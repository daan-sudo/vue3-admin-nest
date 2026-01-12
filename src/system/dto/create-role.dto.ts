// dto/create-role.dto.ts
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRoleDto {
  @IsString({ message: '角色名称必须是字符串' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  @ApiProperty({ description: '角色名称', example: '管理员' })
  name: string; // 对应 formState.name

  @IsString({ message: '角色编码必须是字符串' })
  @IsNotEmpty({ message: '角色编码不能为空' })
  @ApiProperty({ description: '角色编码', example: 'admin' })
  code: string; // 对应 formState.code

  @IsOptional()
  @IsNumber({}, { message: '排序值必须是数字' })
  @ApiProperty({ description: '排序值', example: 1 })
  orderNum?: number; // 对应 formState.orderNum

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '备注', example: '管理员角色' })
  remark?: string; // 对应 formState.remark

  @IsOptional()
  @IsArray({ message: '菜单权限必须是数组格式' })
  @IsNumber({}, { each: true, message: '菜单ID必须为数字' })
  @ApiProperty({ description: '菜单权限', example: [1, 2] })
  menuIds?: number[]; // 接收前端 checkedMenuIds 的值
}
export class UpdateRoleDto extends CreateRoleDto {
  @IsNumber()
  @IsNotEmpty()
  id: number; // 更新时必须传入 ID
}
