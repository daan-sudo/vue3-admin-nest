import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  Query,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { SystemService } from './system.service';
import { QueryMenuDto } from './dto/query-menu.dto';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PageRoleDto } from './dto/page-role.dto';
import { CreateRoleDto, UpdateRoleDto } from './dto/create-role.dto';
import { PageUserDto } from './dto/page-user.dto';
import { CreateUserDto, UpdateUserSelfDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from 'src/oss/oss.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { RoleListVo } from './vo/role.vo';
import { Role } from 'src/user/entities/role.entity';
import { UserListVo } from './vo/user.vo';
import { User } from 'src/user/entities/user.entity';

@Controller('system')
@ApiBearerAuth('token') // 必须和 main.ts 中的 ID 一致
export class SystemController {
  @Inject(OssService)
  private ossService: OssService;
  constructor(private readonly systemService: SystemService) {}
  // 获取菜单列表
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '获取菜单列表' })
  @ApiQuery({
    description: '获取菜单列表',
    type: QueryMenuDto,
  })
  @ApiResponse({
    description: '获取菜单列表',
    // type: ResponseVo,
  })
  @Get('menuList')
  async menuList(@Query() query: QueryMenuDto) {
    console.log(query, 'query');
    return await this.systemService.menuList(query);
  }
  // 根据用户返回指定菜单
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '根据用户返回指定菜单' })
  @ApiQuery({
    name: 'userId', // 参数名
    type: Number, // 指定类型为数字
    description: '用户id',
    example: 1, // 示例值
    required: true, // 是否必填
  })
  @ApiResponse({
    description: '根据用户返回指定菜单',
    // type: ResponseVo,
  })
  @Get('menu/listByUser')
  async menuListByUser(@Query('userId') userId: number) {
    return await this.systemService.menuListByUser(+userId);
  }
  // 添加菜单
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '添加菜单' })
  @ApiBody({
    description: '添加菜单',
    type: CreateMenuDto,
  })
  @ApiResponse({
    description: '添加菜单',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'string', example: '添加成功' },
      },
    },
  })
  @Post('menu/add')
  async addMenu(@Body() body: CreateMenuDto) {
    console.log(body, 'body');
    return await this.systemService.addMenu(body);
  }
  // 更新菜单
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '更新菜单' })
  @ApiBody({
    description: '更新菜单',
    type: UpdateMenuDto,
  })
  @ApiResponse({
    description: '更新菜单',
  })
  @Post('menu/update')
  async updateMenu(@Body() body: UpdateMenuDto) {
    return await this.systemService.updateMenu(body.id, body);
  }
  // 删除菜单
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '删除菜单' })
  @ApiBody({
    description: '删除菜单',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '菜单ID',
          example: 1,
        },
      },
      required: ['id'],
    },
  })
  @ApiResponse({
    description: '删除菜单',
  })
  @Post('menu/delete')
  async deleteMenu(@Body('id') id: number) {
    return await this.systemService.removeMenu(id);
  }
  // 分页获取权限列表
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '分页获取权限列表' })
  @ApiQuery({
    description: '分页获取权限列表',
    type: PageRoleDto,
  })
  @ApiResponse({
    description: '分页获取权限列表',
    type: RoleListVo,
  })
  @Get('roleList')
  async roleList(@Query() query: PageRoleDto) {
    return await this.systemService.roleList(query);
  }
  // 添加权限
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '添加权限' })
  @ApiBody({
    description: '添加权限',
    type: CreateRoleDto,
  })
  @ApiResponse({
    description: '添加权限',
    type: Role,
  })
  @Post('role/add')
  async addRole(@Body() body: CreateRoleDto) {
    return await this.systemService.addRole(body);
  }
  // 更新权限
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '更新权限' })
  @ApiBody({
    description: '更新权限',
    type: UpdateRoleDto,
  })
  @ApiResponse({
    description: '更新权限',
    type: Role,
  })
  @Post('role/update')
  async updateRole(@Body() body: UpdateRoleDto) {
    return await this.systemService.updateRole(body);
  }
  // 删除权限
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '删除权限' })
  @ApiBody({
    description: '删除权限',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '权限ID',
          example: 1,
        },
      },
      required: ['id'],
    },
  })
  @ApiResponse({
    description: '删除权限',
    type: Role,
  })
  @Post('role/delete')
  async deleteRole(@Body('id') id: number) {
    return await this.systemService.removeRole(id);
  }
  // 获取用户角色列表
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '获取用户角色列表' })
  @ApiQuery({
    description: '获取用户角色列表',
    type: PageUserDto,
  })
  @ApiResponse({
    description: '获取用户角色列表',
    type: UserListVo,
  })
  @Get('user/list')
  async userList(@Query() query: PageUserDto) {
    return await this.systemService.userList(query);
  }
  // 获取部门列表 树形结构
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '获取部门列表 树形结构' })
  @ApiResponse({
    description: '获取部门列表 树形结构',
  })
  @Get('dept/list')
  async deptList() {
    return await this.systemService.deptList();
  }
  //创建新用户
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '创建新用户' })
  @ApiBody({
    description: '创建新用户',
    type: CreateUserDto,
  })
  @ApiResponse({
    description: '创建新用户',
    type: User,
  })
  @Post('user/add')
  async addUser(@Body() body: CreateUserDto) {
    return await this.systemService.addUser(body);
  }
  // 更新用户
  @SetMetadata('require-login', true)
  @ApiOperation({ summary: '更新用户' })
  @ApiBody({
    description: '更新用户',
    type: UpdateUserSelfDto,
  })
  @ApiResponse({
    description: '更新用户',
    type: User,
  })
  @Post('user/update')
  async updateUser(@Body() body: UpdateUserSelfDto) {
    return await this.systemService.updateUser(body);
  }
  @SetMetadata('require-login', true)
  @Post('upload/avatar')
  @ApiOperation({ summary: '上传用户头像' })
  @ApiBody({
    description: '上传图片文件',
    schema: {
      type: 'object',
      properties: {
        file: {
          // 这里的 key 要和下面 @UploadedFile('file') 一致
          type: 'string',
          format: 'binary',
          description: '图像文件',
        },
      },
    },
  })
  @ApiResponse({
    description: '上传用户头像',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: '图片地址',
          example: 'https://oss.example.com/avatars/1.jpg',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file')) // 'file' 需对应前端 FormData 的 key
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择上传文件');
    }

    // 调用封装好的上传方法，存放在 avatars 目录
    const url = await this.ossService.upload(file, 'avatars');

    return url;
  }
}
