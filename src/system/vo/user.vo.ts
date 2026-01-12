import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class UserListVo {
  @ApiProperty({ description: '当前页码', example: 1 })
  current: number;
  @ApiProperty({ description: '每页数量', example: 10 })
  pageSize: number;
  @ApiProperty({ description: '用户列表', type: [User] })
  records: User[];
  @ApiProperty({ description: '总数', example: 100 })
  total: number;
}
