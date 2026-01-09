// src/system/dto/create-menu.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMenuDto {
  @IsOptional() // 允许为空
  @IsNumber()
  parentId: number;

  @IsNotEmpty({ message: '菜单名称不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '菜单类型不能为空' })
  @IsNumber()
  // 1-目录，2-菜单，3-按钮
  type: number;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  permission?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orderNum?: number;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  component?: string;
}
