// user.dto.ts
// dto/page-role.dto.ts
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class PageUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '当前页码', example: 1 })
  current: number = 1; // 当前页码

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ description: '每页条数', example: 10 })
  pageSize: number = 10; // 每页条数

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '用户名', example: 'pqf' })
  username?: string; // 可选：按角色名称模糊搜索

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '状态', example: '1' })
  status?: string;
}
