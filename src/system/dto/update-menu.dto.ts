import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends CreateMenuDto {
  @IsNumber()
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: number;
}
