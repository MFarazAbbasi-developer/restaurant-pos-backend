import { IsString, IsArray, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  menuItemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsString()
  @IsNotEmpty()
  deliveryName: string;

  @IsString()
  @IsNotEmpty()
  deliveryPhone: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsArray()
  @IsNotEmpty()
  items: OrderItemDto[];
}
