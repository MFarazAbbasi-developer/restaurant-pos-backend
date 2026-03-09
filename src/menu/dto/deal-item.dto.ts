import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class DealItemDto {
  @IsInt()
  id: number; // represents externalId

  @IsInt()
  menuItemId: number; // ✅ add this, represents the MenuItem externalId

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsInt()
  rank?: number;

  @IsString()
  name: string;

  @Type(() => Number)
  @IsNumber()
  price: number;
}
