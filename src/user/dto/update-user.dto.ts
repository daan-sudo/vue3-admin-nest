import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nickName?: string;
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsPhoneNumber('CN')
  @IsString()
  phone: string;
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail()
  @IsString()
  email: string;
  @IsOptional()
  @IsNumber()
  sex?: number;
  @IsOptional()
  @IsString()
  avatar?: string;
}
export class UpdatePasswordDto {
  @IsNotEmpty({ message: '旧密码不能为空' })
  @IsString()
  @Length(6, 20, { message: '密码长度为6-20位' })
  oldPassword: string;
  @IsNotEmpty({ message: '新密码不能为空' })
  @IsString()
  @Length(6, 20, { message: '密码长度为6-20位' })
  newPassword: string;
}
