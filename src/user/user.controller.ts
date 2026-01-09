import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login-user.dto';
import svgCaptcha from 'svg-captcha';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from 'src/redis/redis.service';
import { OssService } from 'src/oss/oss.service';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(RedisService)
  private redisService: RedisService;
  @Inject(OssService)
  private ossService: OssService;

  @Get('captcha')
  async getCaptcha() {
    const captcha = svgCaptcha.createMathExpr({
      //可配置返回的图片信息
      size: 4, // 验证码长度
      ignoreChars: '0oO1ilI', // 验证码字符中排除 0oO1ilI
      noise: 2, // 干扰线条的数量
      width: 132,
      height: 40,
      fontSize: 50,
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: '#fff',
    });
    const key = `captcha:${uuidv4()}`;
    this.redisService.set(key, captcha.text, 60 * 5); //验证码存入redis，5分钟过期
    return {
      svg: captcha.data,
      captchaKey: key,
    };
    // ession.captchaCode = captcha.text; //使用session保存验证，用于登陆时验证
    // res.type('image/svg+xml'); //指定返回的类型
    // return res.send(responseMessage(captcha.data)); //给页面返回一张图片s
  }
  @Post('login')
  async login(@Body() body: LoginDto) {
    console.log(body);
    return this.userService.login(body);
  }
  //获取用户信息
  @RequireLogin()
  @Get('info')
  async info(@UserInfo('id') id: number) {
    console.log(id, 'id');
    return this.userService.info(+id);
  }
  // 更新用户信息
  @RequireLogin()
  @Patch('update')
  async updateUser(@UserInfo('id') id: number, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(+id, body);
  }
  // 修改密码
  @RequireLogin()
  @Post('updatePassword')
  async updatePassword(
    @UserInfo('id') id: number,
    @Body() body: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(+id, body);
  }
}
