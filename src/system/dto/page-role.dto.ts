// dto/page-role.dto.ts
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PageRoleDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '页码', example: 1 })
  current: number = 1; // 当前页码

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '每页条数', example: 10 })
  pageSize: number = 10; // 每页条数

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '权限名称', example: 'admin' })
  name?: string; // 可选：按角色名称模糊搜索

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '角色编码', example: 'admin' })
  code?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '创建时间区间', example: '2023-01-01' })
  createTimeStart?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '创建时间区间', example: '2023-01-01' })
  createTimeEnd?: string;
}
