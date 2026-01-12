import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class QueryMenuDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '姓名', example: '答案' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '路径', example: '/user' })
  path?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '创建时间开始', example: '2025-01-01' })
  createTimeStart?: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '创建时间结束', example: '2026-01-01' })
  createTimeEnd?: string;
}
