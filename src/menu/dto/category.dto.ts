import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MenuItemDto } from './menu-item.dto';

export class CategoryDto {
  @IsInt()
id: number;  // represents externalId

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  show_in_orders: boolean;

  @IsOptional()
  @IsInt()
  rank?: number;

  @IsOptional()
  @IsInt()
  default_station_id?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items: MenuItemDto[];
}
