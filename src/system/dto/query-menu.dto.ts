import { IsOptional, IsString, IsArray } from 'class-validator';

export class QueryMenuDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  createTimeStart?: string;
  @IsOptional()
  @IsString()
  createTimeEnd?: string;
}
