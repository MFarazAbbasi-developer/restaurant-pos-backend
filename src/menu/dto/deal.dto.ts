import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DealItemDto } from './deal-item.dto';

export class DealDto {
  @IsInt()
id: number;  // represents externalId

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DealItemDto)
  items: DealItemDto[];
}