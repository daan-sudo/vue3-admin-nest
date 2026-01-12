import { ApiProperty } from '@nestjs/swagger';
export class CaptchaVO {
  @ApiProperty({ description: '验证码xml', example: '<xml>12434<xml>' })
  svg: string;
  @ApiProperty({ description: '验证码key', example: '1234' })
  captchaKey: string;
}
