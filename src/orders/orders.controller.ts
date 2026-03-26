import { Body, Controller, Post, Get, Headers } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Existing endpoint
  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  // NEW endpoint: Fetch unsynced orders for POS
  @Get('unsynced')
  getUnsyncedOrders(@Headers('x-api-key') apiKey: string) {
    return this.ordersService.getUnsyncedOrders(apiKey);
  }

  @Post('ack')
  acknowledgeOrders(
    @Headers('x-api-key') apiKey: string,
    @Body() body: { orderIds: string[] },
  ) {
    return this.ordersService.acknowledgeOrders(apiKey, body.orderIds);
  }
}
