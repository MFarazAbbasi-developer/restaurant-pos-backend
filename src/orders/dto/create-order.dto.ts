import { IsArray, IsString, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  menuItemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

class OrderDealDto {
  @IsString()
  dealId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  restaurantId: string;

  @IsString()
  customerId: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsString()
  country: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDealDto)
  deals: OrderDealDto[];
}
