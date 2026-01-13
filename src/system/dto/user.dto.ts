// dto/user.dto.ts
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsEmail,
  IsMobilePhone,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @IsOptional()
  @IsString()
  nickName?: string;

  @IsOptional()
  @IsNumber()
  sex?: number;

  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
  // 头像
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsNumber({}, { message: '请选择正确的部门' })
  @IsNotEmpty({ message: '所属部门不能为空' })
  deptId: number; // 对应实体中的 deptId 物理字段

  @IsArray({ message: '角色必须是数组格式' })
  @IsNotEmpty({ message: '请为用户分配角色' })
  roleIds: number[]; // 接收前端传来的角色 ID 数组
}

// 更新 DTO 继承创建 DTO
export class UpdateUserSelfDto extends CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  // 更新时密码通常设为可选
  @IsOptional()
  @IsString()
  declare password: string;
}
