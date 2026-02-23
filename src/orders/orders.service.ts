import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(customerId: string, dto: CreateOrderDto) {
    // 1️⃣ Validate branch
    const branch = await this.prisma.branch.findUnique({
      where: { id: dto.branchId },
    });
    if (!branch) throw new BadRequestException('Branch not found');

    // 2️⃣ Fetch all menu items
    const menuItemIds = dto.items.map((i) => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, isAvailable: true },
    });

    if (menuItems.length !== dto.items.length)
      throw new BadRequestException(
        'Some menu items are invalid or unavailable',
      );

    // 3️⃣ Prepare order items and calculate total
    const orderItemsData = dto.items.map((i) => {
      const menuItem = menuItems.find((m) => m.id === i.menuItemId);
      if (!menuItem) {
        throw new BadRequestException(`Menu item ${i.menuItemId} not found`);
      }
      return {
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: i.quantity,
        subtotal: new Prisma.Decimal(menuItem.price.toString()).mul(i.quantity),
      };
    });

    const totalAmount = orderItemsData.reduce(
      (sum, item) => sum.add(item.subtotal),
      new Prisma.Decimal(0),
    );

    // 4️⃣ Create order
    const order = await this.prisma.order.create({
      data: {
        customerId,
        branchId: dto.branchId,
        deliveryName: dto.deliveryName,
        deliveryPhone: dto.deliveryPhone,
        deliveryAddress: dto.deliveryAddress,
        totalAmount,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    return order;
  }

  async getOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { items: true, branch: true },
    });
  }
}
