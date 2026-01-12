import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateMenuDto } from './create-menu.dto';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateMenuDto extends CreateMenuDto {
  @IsNumber()
  @IsNotEmpty({
    message: 'id不能为空',
  })
  @ApiProperty({ description: 'id', example: 1 })
  id: number;
}
