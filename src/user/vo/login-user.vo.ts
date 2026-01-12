import { ApiProperty } from '@nestjs/swagger';
export class LoginVo {
  @ApiProperty({ description: 'token', example: 'admin' })
  access_token: string;
  @ApiProperty({ description: '刷新token', example: 'admin' })
  refresh_token: string;
}
