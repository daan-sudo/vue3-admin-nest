// login-vo.dto.ts
import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
export class LoginVo {
  access_token: string;
  refresh_token: string;
}
// PickType 可以让你从 Entity 中直接“捡”出需要的字段，不需要重复定义
export class UserInfoVo extends PickType(User, [
  'id',
  'username',
  'avatar',
  'phone',
  'email',
  'roles',
  'status',
  'deptId',
  'department',
  'sex',
  'remark',
  'nickName',
] as const) {
  // 额外增加 Entity 里没有的字段
}
