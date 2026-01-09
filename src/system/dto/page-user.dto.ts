// user.dto.ts
// dto/page-role.dto.ts
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class PageUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  current: number = 1; // 当前页码

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10; // 每页条数

  @IsOptional()
  @IsString()
  username?: string; // 可选：按角色名称模糊搜索

  @IsOptional()
  @IsString()
  status?: string;
}
