import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsInt,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MenuItemDto {
  @IsInt()
  id: number; // represents externalId

  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  rank?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsNumber()
  cost_price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  food_panda_price?: number;

  @IsBoolean()
  is_available: boolean;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsInt()
  station_id?: number;
}
