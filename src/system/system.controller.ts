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
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from 'src/oss/oss.service';

@Controller('system')
export class SystemController {
  @Inject(OssService)
  private ossService: OssService;
  constructor(private readonly systemService: SystemService) {}
  // 获取菜单列表
  @SetMetadata('require-login', true)
  @Get('menuList')
  async menuList(@Query() query: QueryMenuDto) {
    console.log(query, 'query');
    return await this.systemService.menuList(query);
  }
  // 根据用户返回指定菜单
  @SetMetadata('require-login', true)
  @Get('menu/listByUser')
  async menuListByUser(@Query('userId') userId: number) {
    return await this.systemService.menuListByUser(+userId);
  }
  // 添加菜单
  @SetMetadata('require-login', true)
  @Post('menu/add')
  async addMenu(@Body() body: CreateMenuDto) {
    console.log(body, 'body');
    return await this.systemService.addMenu(body);
  }
  // 更新菜单
  @SetMetadata('require-login', true)
  @Post('menu/update')
  async updateMenu(@Body() body: UpdateMenuDto) {
    return await this.systemService.updateMenu(body.id, body);
  }
  // 删除菜单
  @SetMetadata('require-login', true)
  @Post('menu/delete')
  async deleteMenu(@Body('id') id: number) {
    return await this.systemService.removeMenu(id);
  }
  // 分页获取权限列表
  @SetMetadata('require-login', true)
  @Get('roleList')
  async roleList(@Query() query: PageRoleDto) {
    return await this.systemService.roleList(query);
  }
  // 添加权限
  @SetMetadata('require-login', true)
  @Post('role/add')
  async addRole(@Body() body: CreateRoleDto) {
    return await this.systemService.addRole(body);
  }
  // 更新权限
  @SetMetadata('require-login', true)
  @Post('role/update')
  async updateRole(@Body() body: UpdateRoleDto) {
    return await this.systemService.updateRole(body);
  }
  // 删除权限
  @SetMetadata('require-login', true)
  @Post('role/delete')
  async deleteRole(@Body('id') id: number) {
    return await this.systemService.removeRole(id);
  }
  // 获取用户角色列表
  @SetMetadata('require-login', true)
  @Get('user/list')
  async userList(@Query() query: PageUserDto) {
    return await this.systemService.userList(query);
  }
  // 获取部门列表 树形结构
  @SetMetadata('require-login', true)
  @Get('dept/list')
  async deptList() {
    return await this.systemService.deptList();
  }
  //创建新用户
  @SetMetadata('require-login', true)
  @Post('user/add')
  async addUser(@Body() body: CreateUserDto) {
    return await this.systemService.addUser(body);
  }
  // 更新用户
  @SetMetadata('require-login', true)
  @Post('user/update')
  async updateUser(@Body() body: UpdateUserDto) {
    return await this.systemService.updateUser(body);
  }
  @SetMetadata('require-login', true)
  @Post('upload/avatar')
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
