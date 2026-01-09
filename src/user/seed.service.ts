import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Menu } from './entities/menu.entity';
import { Department } from './entities/department.entity';
import { hashPassword } from '../utils/index';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Menu) private menuRepo: Repository<Menu>,
    @InjectRepository(Department) private deptRepo: Repository<Department>,
  ) {}
  // @InjectEntityManager()
  // private manager: EntityManager;

  async onModuleInit() {
    // 1. 初始化部门 (科技公司常规架构)
    const depts = await this.initDepartments();

    // 2. 初始化菜单 (3级结构)
    const menus = await this.initMenus();

    // 3. 初始化角色
    const roles = await this.initRoles(menus);

    // 4. 初始化/更新 Admin 用户
    await this.initAdmin(depts[0], roles); // 默认分在总经办
  }

  private async initDepartments() {
    if ((await this.deptRepo.count()) > 0) return await this.deptRepo.find();

    // 一级部门
    const head = await this.deptRepo.save({
      name: '清风科技总经办',
      parentId: 0,
      orderNum: 1,
    });
    // 二级部门
    const dev = await this.deptRepo.save({
      name: '研发中心',
      parentId: head.id,
      orderNum: 2,
    });
    const product = await this.deptRepo.save({
      name: '产品部',
      parentId: head.id,
      orderNum: 3,
    });
    const hr = await this.deptRepo.save({
      name: '人事行政部',
      parentId: head.id,
      orderNum: 4,
    });
    const market = await this.deptRepo.save({
      name: '市场推广部',
      parentId: head.id,
      orderNum: 5,
    });

    return [head, dev, product, hr, market];
  }

  private async initMenus() {
    if ((await this.menuRepo.count()) > 0) return await this.menuRepo.find();
    // 其他一级
    await this.menuRepo.save({
      name: '首页',
      type: 1,
      icon: 'MonitorOutlined',
      path: '/home',
      orderNum: 0,
    });
    // 一级：系统管理 (目录)
    const sysMgt = await this.menuRepo.save({
      name: '系统管理',
      type: 1,
      icon: 'SettingOutlined',
      path: '/system',
      orderNum: 1,
    });

    // 二级：用户管理 (菜单)
    const userMgt = await this.menuRepo.save({
      name: '用户管理',
      type: 2,
      parentId: sysMgt.id,
      path: '/system/user',
      icon: 'UserOutlined',
      orderNum: 1,
    });
    const menuMgt = await this.menuRepo.save({
      name: '菜单管理',
      type: 2,
      parentId: sysMgt.id,
      path: '/system/menu',
      orderNum: 2,
      icon: 'PicCenterOutlined',
    });

    // 三级：用户按钮 (权限)
    // await this.menuRepo.save({
    //   name: '用户查询',
    //   type: 2,
    //   parentId: userMgt.id,
    //   permission: 'sys:user:query',
    // });
    // const userAdd = await this.menuRepo.save({
    //   name: '用户新增',
    //   type: 2,
    //   parentId: userMgt.id,
    //   permission: 'sys:user:add',
    // });

    return [sysMgt, userMgt, menuMgt];
  }

  private async initRoles(menus: Menu[]) {
    // 检查是否已有数据，如果有则尝试更新，没有则创建
    const count = await this.roleRepo.count();

    // 我们定义一套标准初始化数据
    const roleList = [
      {
        name: '超级管理员',
        code: 'super_admin',
        remark: '系统最高权限，拥有所有功能模块的操作权限',
        status: 1,
        orderNum: 1,
        menus: menus, // 分配所有初始化菜单
      },
      {
        name: '普通管理员',
        code: 'admin',
        remark: '负责日常行政、用户审核及系统基本维护',
        status: 1,
        orderNum: 2,
        menus: menus.filter((m) => m.name !== '系统管理'), // 举例：过滤掉系统设置权限
      },
      {
        name: '部门主管',
        code: 'dept_manager',
        remark: '负责所属部门的人员管理及数据查看',
        status: 1,
        orderNum: 3,
        menus: [], // 暂时不分配
      },
      {
        name: '普通用户',
        code: 'user',
        remark: '仅拥有前台业务查询及个人中心访问权限',
        status: 1,
        orderNum: 4,
        menus: [],
      },
      {
        name: '访客/测试',
        code: 'guest',
        remark: '临时测试账号，大部分功能仅只读',
        status: 0, // 默认停用状态演示
        orderNum: 5,
        menus: [],
      },
    ];

    const savedRoles: Role[] = [];

    for (const item of roleList) {
      let role = await this.roleRepo.findOne({ where: { code: item.code } });
      if (!role) {
        // 创建新角色
        role = await this.roleRepo.save(this.roleRepo.create(item));
        console.log(`✅ 角色 [${item.name}] 初始化成功`);
      } else {
        // 更新现有角色的基本信息（可选：根据需求决定是否覆盖旧备注或状态）
        Object.assign(role, {
          name: item.name,
          remark: item.remark,
          orderNum: item.orderNum,
          // 如果想重置权限，可以在这里重新赋值
          // menus: item.menus
        });
        role = await this.roleRepo.save(role);
      }
      savedRoles.push(role);
    }

    return savedRoles;
  }

  private async initAdmin(dept: Department, roles: Role[]) {
    const admin = await this.userRepo.findOne({ where: { username: 'admin' } });
    const hashedPassword = await hashPassword('123456');

    const adminData = {
      username: 'admin',
      password: hashedPassword,
      nickName: '答案',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      phone: '18888888888',
      email: 'admin@qf-tech.com',
      sex: 1,
      status: 1,
      deptId: dept.id,
      department: dept,
      roles: [roles[0]], // 分配超级管理员角色
    };

    if (!admin) {
      await this.userRepo.save(this.userRepo.create(adminData));
      console.log('✅ 超级管理员 admin 初始化成功');
    } else {
      // 如果已存在，更新其角色、部门和新字段
      Object.assign(admin, adminData);
      await this.userRepo.save(admin);
      console.log('✅ 超级管理员 admin 数据已同步更新');
    }
  }
}
