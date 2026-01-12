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
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '昵称', example: '答案' })
  nickName?: string;
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsPhoneNumber('CN')
  @IsString()
  @ApiProperty({ description: '手机号', example: '18888888888' })
  phone: string;
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail()
  @IsString()
  @ApiProperty({ description: '邮箱', example: '123456789@qq.com' })
  email: string;
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '性别', example: 1 })
  sex?: number;
  @IsOptional()
  @IsString()
  avatar?: string;
}
export class UpdatePasswordDto {
  @IsNotEmpty({ message: '旧密码不能为空' })
  @IsString()
  @Length(6, 20, { message: '密码长度为6-20位' })
  @ApiProperty({ description: '旧密码', example: '123456' })
  oldPassword: string;
  @IsNotEmpty({ message: '新密码不能为空' })
  @IsString()
  @Length(6, 20, { message: '密码长度为6-20位' })
  @ApiProperty({ description: '新密码', example: '123456' })
  newPassword: string;
}
