import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/user/entities/role.entity';
export class RoleListVo {
  @ApiProperty({ description: '总数', example: 100 })
  total: number;
  @ApiProperty({ description: '当前页码', example: 1 })
  current: number;
  @ApiProperty({ description: '每页数量', example: 10 })
  pageSize: number;
  @ApiProperty({ description: '角色列表', type: [Role] })
  records: Role[];
}
