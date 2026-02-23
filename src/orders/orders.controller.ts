import {
  Controller,
  Post,
  Body,
  Request,
  Get,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    const customerId = 'cmlj9biy20000il68hodet9qy';
    return this.ordersService.createOrder(customerId, dto);
  }

  @Get()
  async getOrders() {
    const customerId = 'cmlj9biy20000il68hodet9qy';
    return this.ordersService.getOrders(customerId);
  }
}
