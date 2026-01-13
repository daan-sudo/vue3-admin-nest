import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/user/entities/menu.entity';
import * as bcrypt from 'bcryptjs'; // 建议对密码进行加密
import {
  Between,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { QueryMenuDto } from './dto/query-menu.dto';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PageRoleDto } from './dto/page-role.dto';
import { Role } from 'src/user/entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto/create-role.dto';
import { PageUserDto } from './dto/page-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Department } from 'src/user/entities/department.entity';
import { CreateUserDto, UpdateUserSelfDto } from './dto/user.dto';
import { RoleListVo } from './vo/role.vo';
import { UserListVo } from './vo/user.vo';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(Menu)
    private menuRepo: Repository<Menu>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Department)
    private readonly depRepo: Repository<Department>,
  ) {}
  // 添加菜单
  async addMenu(body: CreateMenuDto) {
    const menuData = {
      ...body,
      parentId: body.parentId || 0,
    };
    const menu = this.menuRepo.create(menuData);

    // 保存到数据库
    await this.menuRepo.save(menu);
    return '添加成功';
  }
  async updateMenu(id: number, updateMenuDto: UpdateMenuDto) {
    // 1. 查找是否存在该菜单
    const menu = await this.menuRepo.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }

    // 2. 如果修改了父级 ID，执行安全性校验
    if (updateMenuDto.parentId) {
      // 禁止将自己设为父级
      if (updateMenuDto.parentId === id) {
        throw new BadRequestException('父级节点不能是菜单本身');
      }

      // 递归校验：禁止将自己的子孙节点设为父级
      const children = await this.findAllChildren(id);
      const childrenIds = children.map((child) => child.id);
      if (childrenIds.includes(updateMenuDto.parentId)) {
        throw new BadRequestException('父级节点不能是自己的子孙节点');
      }
    }

    // 3. 执行更新
    return await this.menuRepo.update(id, updateMenuDto);
  }
  // 辅助方法：递归获取所有子节点
  private async findAllChildren(id: number): Promise<Menu[]> {
    const children = await this.menuRepo.find({ where: { parentId: id } });
    let allChildren = [...children];
    for (const child of children) {
      const descendants = await this.findAllChildren(child.id);
      allChildren = allChildren.concat(descendants);
    }
    return allChildren;
  }
  // 删除
  async removeMenu(id: number) {
    // 1. 获取该菜单的子菜单
    const children = await this.menuRepo.find({ where: { parentId: id } });
    if (children.length > 0) {
      throw new BadRequestException('请先删除该菜单的子菜单');
    }

    // 2. 删除该菜单
    return await this.menuRepo.softDelete(id);
  }
  async menuList(query: QueryMenuDto) {
    const { name, path, createTimeStart, createTimeEnd } = query;

    // 1. 如果没有任何筛选条件，直接执行原有的全量查询逻辑
    if (!name && !path && !createTimeStart) {
      const allMenus = await this.menuRepo.find({ order: { orderNum: 'ASC' } });
      return this.listToTree(allMenus);
    }

    // 2. 构造基础查询，只为了获取匹配到的节点 ID
    const queryBuilder = this.menuRepo
      .createQueryBuilder('menu')
      .select('menu.id');

    if (name)
      queryBuilder.andWhere('menu.name LIKE :name', { name: `%${name}%` });
    if (path)
      queryBuilder.andWhere('menu.path LIKE :path', { path: `%${path}%` });
    if (createTimeStart && createTimeEnd) {
      queryBuilder.andWhere('menu.createTime BETWEEN :start AND :end', {
        start: createTimeStart,
        end: createTimeEnd,
      });
    }

    const matchedMenus = await queryBuilder.getMany(); // 获取匹配的节点
    const matchedIds = matchedMenus.map((m) => m.id);

    if (matchedIds.length === 0) return [];

    // 3. 核心步骤：通过所有匹配的 ID，查找其所有父级和子级
    // 这里我们获取所有菜单数据，在内存中进行路径匹配或使用更复杂的递归 SQL
    // 考虑到菜单表数据量通常不大，先查出全量，再根据匹配项过滤路径是最稳妥的做法
    const allData = await this.menuRepo.find({ order: { orderNum: 'ASC' } });

    // 存储最终需要展示的节点 ID 集合
    const resultSet = new Set<number>();

    // 定义递归函数：向上找父级
    const findAncestors = (id: number) => {
      const item = allData.find((m) => m.id === id);
      if (item) {
        resultSet.add(item.id);
        if (item.parentId !== 0) findAncestors(item.parentId);
      }
    };

    // 定义递归函数：向下找子级
    const findDescendants = (id: number) => {
      resultSet.add(id);
      const children = allData.filter((m) => m.parentId === id);
      children.forEach((child) => findDescendants(child.id));
    };

    // 对每一个匹配到的 ID 执行双向查找
    matchedIds.forEach((id) => {
      findAncestors(id); // 搜子带父
      findDescendants(id); // 搜父带子
    });

    // 4. 从全量数据中过滤出在 resultSet 中的节点
    const finalMenus = allData.filter((m) => resultSet.has(m.id));

    // 5. 返回树形结构
    return this.listToTree(finalMenus);
  }
  private listToTree(list: Menu[]) {
    const res: Menu[] = [];
    const map = new Map();

    // 先将所有项放入 Map 中，并初始化 children 数组
    for (const item of list) {
      map.set(item.id, { ...item, children: [] });
    }

    for (const item of list) {
      const id = item.id;
      const parentId = item.parentId;
      const treeItem = map.get(id);

      if (parentId === 0) {
        // 如果是顶层节点，直接存入结果集
        res.push(treeItem);
      } else {
        // 如果有父级，找到父级并将自己推入父级的 children 中
        const parent = map.get(parentId);
        if (parent) {
          parent.children.push(treeItem);
        }
      }
    }

    // 递归清理掉空的 children 数组（可选，有些前端框架需要）
    this.cleanChildren(res);
    return res;
  }

  private cleanChildren(nodes: Menu[]) {
    nodes.forEach((node: Menu) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      } else if (node.children && node.children.length > 0) {
        this.cleanChildren(node.children);
      }
    });
  }
  // 分页获取角色列表
  async roleList(query: PageRoleDto) {
    const { current, pageSize, name, code, createTimeStart, createTimeEnd } =
      query;

    // 1. 动态构建查询条件
    const where: any = {};

    if (name) {
      where.name = Like(`%${name}%`);
    }

    if (code) {
      where.code = Like(`%${code}%`);
    }

    // 2. 处理时间区间
    if (createTimeStart && createTimeEnd) {
      // 如果两个时间都有，使用 Between
      where.createTime = Between(
        new Date(createTimeStart + ' 00:00:00'),
        new Date(createTimeEnd + ' 23:59:59'),
      );
    } else if (createTimeStart) {
      where.createTime = MoreThanOrEqual(
        new Date(createTimeStart + ' 00:00:00'),
      );
    } else if (createTimeEnd) {
      where.createTime = LessThanOrEqual(new Date(createTimeEnd + ' 23:59:59'));
    }

    // 3. 执行查询
    const [list, total] = await this.roleRepo.findAndCount({
      where,
      // 关键修改：加载 menus 关联关系
      relations: ['menus'],
      order: { createTime: 'DESC' }, // 最新创建的排在前面
      skip: (current - 1) * pageSize,
      take: pageSize,
    });
    // 4. 处理返回数据，将 menus 转换为 menuIds 数组以适配前端 RoleModal
    const records = list.map((role) => {
      return {
        ...role,
        menuIds: role.menus ? role.menus.map((menu) => menu.id) : [],
      };
    });
    const vo = new RoleListVo();
    vo.total = total;
    vo.records = records;
    vo.current = current;
    vo.pageSize = pageSize;
    return vo;
    // return {
    //   records,
    //   total,
    //   current,
    //   pageSize,
    // };
  }
  async addRole(createRoleDto: CreateRoleDto) {
    const { menuIds, ...roleData } = createRoleDto;

    // 1. 创建角色实例对象
    const role = this.roleRepo.create(roleData);

    // 2. 如果传入了菜单ID数组，处理权限关联
    if (menuIds && menuIds.length > 0) {
      // 根据 ID 数组查询出所有的菜单实体
      const menus = await this.menuRepo.findBy({
        id: In(menuIds),
      });
      console.log(menus, 'menus');
      // 建立多对多关联关系
      role.menus = menus;
    }

    // 3. 保存角色及关联关系
    // TypeORM 会自动向 sys_role 表插入角色，向 sys_role_menu 表插入关联记录
    return await this.roleRepo.save(role);
  }
  async updateRole(updateRoleDto: UpdateRoleDto) {
    const { id, menuIds, ...updateData } = updateRoleDto;

    // 1. 查找现有角色并加载关联权限
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['menus'],
    });

    if (!role) {
      throw new NotFoundException(`未找到 ID 为 ${id} 的角色`);
    }

    // 2. 覆盖基础属性
    Object.assign(role, updateData);

    // 3. 更新关联的菜单实体
    if (menuIds) {
      const menus = await this.menuRepo.findBy({
        id: In(menuIds),
      });
      role.menus = menus; // 直接赋值，TypeORM 会处理中间表 sys_role_menu
    }

    // 4. 保存 (由于带 ID，TypeORM 会执行更新操作)
    return await this.roleRepo.save(role);
  }
  /**
   * 删除角色
   * @param id 角色ID
   */
  async removeRole(id: number) {
    // 1. 先检查角色是否存在
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) {
      throw new NotFoundException(`ID为 ${id} 的角色不存在`);
    }

    // 2. 执行删除
    // 注意：由于配置了 ManyToMany 关系，TypeORM 会自动删除 sys_role_menu 中对应的关联记录
    // return await this.roleRepo.remove(role); //真删除
    return await this.roleRepo.softRemove(role); //假删除
  }
  async userList(query: PageUserDto) {
    const { current = 1, pageSize = 10, username, status } = query;

    // 1. 构建动态查询条件
    const where: any = {};

    if (username) {
      where.username = Like(`%${username}%`);
    }

    if (status !== undefined && status !== '') {
      where.status = status;
    }

    // 2. 执行关联查询
    const [list, total] = await this.userRepo.findAndCount({
      where,
      // 加载 department 和 roles 关联
      relations: ['department', 'roles', 'department.parent'],
      order: { createTime: 'DESC' },
      skip: (current - 1) * pageSize,
      take: pageSize,
    });
    const vo = new UserListVo();
    vo.total = total;
    vo.records = list;
    vo.current = current;
    vo.pageSize = pageSize;
    return vo;
    // 3. 格式化返回结果，确保适配前端表格字段
    // return {
    //   records: list,
    //   total,
    //   current,
    //   pageSize,
    // };
  }
  // 获取部门列表
  async deptList() {
    // return await this.depRepo.find({
    //   relations: ['parent'],
    // });
    // 1. 查出所有部门，按 orderNum 排序
    const allDepts = await this.depRepo.find({
      order: { orderNum: 'DESC' },
    });

    // 2. 调用转换算法
    return this.listToTree2(allDepts);
  }
  private listToTree2(list: Department[]) {
    const tree: Department[] = [];
    const map = new Map();
    list.forEach((item) => {
      map.set(item.id, { ...item, children: [] });
    });

    list.forEach((item) => {
      const node = map.get(item.id);
      if (item.parentId === 0) {
        // 根节点（parentId 为 0）
        tree.push(node);
      } else {
        // 找到父节点并推入其 children 数组
        const parent = map.get(item.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // 如果找不到父节点（可能数据异常），可以视作根节点或丢弃
          tree.push(node);
        }
      }
    });
    return tree;
  }
  async addUser(createUserDto: CreateUserDto) {
    const { roleIds, password, ...userData } = createUserDto;
    // 1. 检查用户名是否存在
    const exists = await this.userRepo.findOneBy({
      username: userData.username,
    });
    if (exists) throw new BadRequestException('用户名已存在');
    // 2. 创建用户实例并加密密码
    const user = this.userRepo.create(userData);
    user.password = await bcrypt.hash(password, 10);
    // 3. 关联角色
    if (roleIds && roleIds.length > 0) {
      user.roles = await this.roleRepo.findBy({ id: In(roleIds) });
    }
    return await this.userRepo.save(user);
  }
  // 修改用户
  async updateUser(updateUserDto: UpdateUserSelfDto) {
    const { id, roleIds, password, ...updateData } = updateUserDto;
    // 1. 获取现有用户及角色关系
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) throw new BadRequestException('用户不存在');
    // 2. 更新基础信息
    Object.assign(user, updateData);
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    // 4. 更新角色关联 (TypeORM 会自动处理 sys_user_role 中间表)
    if (roleIds) {
      user.roles = await this.roleRepo.findBy({ id: In(roleIds) });
    }
    return await this.userRepo.save(user);
  }
  // 根据用户返回对应的菜单树形结构
  async menuListByUser(userId: number) {
    // 1. 获取用户拥有的所有原始菜单
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.menus'],
    });

    if (!user || !user.roles) return [];

    // 提取原始菜单 ID
    const originMenuIds = new Set<number>();
    user.roles.forEach((role) => {
      role.menus.forEach((menu) => originMenuIds.add(menu.id));
    });

    if (originMenuIds.size === 0) return [];

    // 2. 补全父级节点
    // 查出全量菜单用于内存计算，避免多次查库
    const allMenusFromDb = await this.menuRepo.find();
    const menuMap = new Map(allMenusFromDb.map((m) => [m.id, m]));

    const completeMenuMap = new Map<number, Menu>();

    // 核心补全算法
    originMenuIds.forEach((id) => {
      let current = menuMap.get(id);
      while (current) {
        completeMenuMap.set(current.id, current); // 添加当前节点
        if (current.parentId === 0) break; // 到顶了
        current = menuMap.get(current.parentId); // 向上找
      }
    });

    // 3. 排序并转为树形
    const sortedList = Array.from(completeMenuMap.values()).sort(
      (a, b) => (a.orderNum || 0) - (b.orderNum || 0),
    );

    return this.listToTree(sortedList);
  }
}
