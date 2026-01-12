import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  @ApiProperty({ description: '用户名', example: 'admin' })
  readonly username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  @Length(6, 20, { message: '密码长度需在6-20位之间' })
  @ApiProperty({ description: '密码', example: '123456' })
  readonly password: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString()
  @ApiProperty({ description: '验证码', example: '3456' })
  readonly captcha: string;

  @IsNotEmpty({ message: '验证码凭证无效' })
  @IsString()
  @ApiProperty({ description: '验证码key', example: '1234564554354' })
  readonly captchaKey: string;
}
