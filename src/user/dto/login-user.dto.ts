import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  readonly username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  @Length(6, 20, { message: '密码长度需在6-20位之间' })
  readonly password: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString()
  readonly captcha: string;

  @IsNotEmpty({ message: '验证码凭证无效' })
  @IsString()
  readonly captchaKey: string;
}
