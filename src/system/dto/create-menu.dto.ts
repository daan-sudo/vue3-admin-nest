import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: '父节点id', example: 1 })
  parentId: number;

  @IsNotEmpty({ message: '菜单名称不能为空' })
  @IsString()
  @ApiProperty({ description: '菜单名称', example: '系统管理' })
  name: string;

  @IsNotEmpty({ message: '菜单类型不能为空' })
  @IsNumber()
  @ApiProperty({ description: '菜单类型', example: 1 })
  // 1-目录，2-菜单，3-按钮
  type: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '菜单路径', example: '/system' })
  path?: string;

  @IsOptional()
  @IsString()
  permission?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ description: '排序', example: 1 })
  orderNum?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '图标', example: 'icon' })
  icon?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '组件', example: 'system' })
  component?: string;
}
