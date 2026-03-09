import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryDto } from './category.dto';
import { DealDto } from './deal.dto';

export class SyncMenuDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  categories: CategoryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DealDto)
  deals: DealDto[];
}
