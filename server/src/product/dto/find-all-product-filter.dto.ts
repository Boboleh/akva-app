import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
export class FindAllProductFilterDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  id?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  name?: string[];
}
