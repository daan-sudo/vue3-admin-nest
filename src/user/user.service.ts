import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginVo, UserInfoVo } from './vo/login-user.vo';
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
// const svgCaptcha = require('svg-captcha');
@Injectable()
export class UserService {
  @Inject(RedisService)
  private redisService: RedisService;
  @Inject(JwtService)
  private jwtService: JwtService;
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  // 登录
  async login(user: LoginDto) {
    const captcha = await this.redisService.get(user.captchaKey);
    console.log(captcha, 'captcha');
    if (captcha !== user.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password') // 手动把默认隐藏的密码字段加进来
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.menus', 'menus')
      .leftJoinAndSelect('user.department', 'dept') // <--- 新增：关联部门
      .where('user.username = :username', { username: user.username })
      .getOne();
    console.log(foundUser, 'foundUser');
    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(user.password, foundUser.password);
    if (!isMatch) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    const vo = new LoginVo();
    const access_token = this.jwtService.sign(
      {
        id: foundUser.id,
        username: foundUser.username,
      },
      {
        expiresIn: '1d',
      },
    );
    const refresh_token = this.jwtService.sign(
      {
        id: foundUser.id,
      },
      {
        expiresIn: '7d',
      },
    );
    vo.access_token = access_token;
    vo.refresh_token = refresh_token;

    return vo;
  }
  // 获取用户信息
  async info(id: number) {
    if (!id) {
      throw new HttpException('id不存在', HttpStatus.NOT_FOUND);
    }
    const foundUser = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.menus', 'menus')
      .leftJoinAndSelect('user.department', 'dept')
      .where('user.id = :id', { id })
      .getOne();
    const vo = new UserInfoVo();
    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    vo.id = foundUser.id;
    vo.username = foundUser.username;
    vo.avatar = foundUser.avatar;
    vo.roles = foundUser.roles;
    vo.department = foundUser.department;
    vo.status = foundUser.status;
    vo.phone = foundUser.phone;
    vo.email = foundUser.email;
    vo.deptId = foundUser.deptId;
    vo.remark = foundUser.remark;
    vo.sex = foundUser.sex;
    vo.nickName = foundUser.nickName;
    return vo;
  }
  async updateUser(id: number, body: UpdateUserDto) {
    const foundUser = await this.userRepo.findOneBy({ id });
    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    const updateUser = Object.assign(foundUser, body);
    await this.userRepo.save(updateUser);
    return '更新成功';
  }
  async updatePassword(id: number, body: UpdatePasswordDto) {
    const foundUser = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password') // 关键：手动把 select: false 的字段加回来
      .where('user.id = :id', { id })
      .getOne();
    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const isMatch = await bcrypt.compare(body.oldPassword, foundUser.password);
    if (!isMatch) {
      throw new HttpException('旧密码错误', HttpStatus.BAD_REQUEST);
    }
    foundUser.password = await bcrypt.hash(body.newPassword, 10);
    await this.userRepo.save(foundUser);
    return '更新密码成功';
  }
}
