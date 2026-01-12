import { ApiProperty } from '@nestjs/swagger';
export class ResponseVo<T> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;
  @ApiProperty({ description: '状态信息', example: 'success' })
  message: string;
  data?: T;
}
