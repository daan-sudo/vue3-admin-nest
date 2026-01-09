// dto/create-role.dto.ts
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: '角色名称必须是字符串' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  name: string; // 对应 formState.name

  @IsString({ message: '角色编码必须是字符串' })
  @IsNotEmpty({ message: '角色编码不能为空' })
  code: string; // 对应 formState.code

  @IsOptional()
  @IsNumber({}, { message: '排序值必须是数字' })
  orderNum?: number; // 对应 formState.orderNum

  @IsOptional()
  @IsString()
  remark?: string; // 对应 formState.remark

  @IsOptional()
  @IsArray({ message: '菜单权限必须是数组格式' })
  @IsNumber({}, { each: true, message: '菜单ID必须为数字' })
  menuIds?: number[]; // 接收前端 checkedMenuIds 的值
}
export class UpdateRoleDto extends CreateRoleDto {
  @IsNumber()
  @IsNotEmpty()
  id: number; // 更新时必须传入 ID
}
