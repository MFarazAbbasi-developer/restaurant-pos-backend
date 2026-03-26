import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      let totalAmount = new Prisma.Decimal(0);

      // 1️⃣ Validate Restaurant
      const restaurant = await tx.restaurant.findUnique({
        where: { id: dto.restaurantId },
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      // 2️⃣ Validate Customer
      const customer = await tx.customer.findUnique({
        where: { id: dto.customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // 3️⃣ Create Order First
      const order = await tx.order.create({
        data: {
          restaurantId: dto.restaurantId,
          customerId: dto.customerId,
          street: dto.street,
          city: dto.city,
          state: dto.state,
          zipCode: dto.zipCode,
          country: dto.country,
          totalAmount: new Prisma.Decimal(0),
        },
      });

      // 4️⃣ Process Menu Items
      if (dto.items && dto.items.length > 0) {
        for (const item of dto.items) {
          const menuItem = await tx.menuItem.findFirst({
            where: {
              id: item.menuItemId,
              restaurantId: dto.restaurantId,
            },
          });

          if (!menuItem) {
            throw new NotFoundException(
              `Menu item not found: ${item.menuItemId}`,
            );
          }

          if (!menuItem.isAvailable) {
            throw new BadRequestException(
              `Menu item unavailable: ${menuItem.name}`,
            );
          }

          const lineTotal = menuItem.price.mul(item.quantity);
          totalAmount = totalAmount.plus(lineTotal);

          await tx.orderItem.create({
            data: {
              orderId: order.id,
              menuItemId: menuItem.id,
              externalId: menuItem.externalId, // Added externalId
              name: menuItem.name,
              quantity: item.quantity,
              price: menuItem.price,
            },
          });
        }
      }

      // 5️⃣ Process Deals
      if (dto.deals && dto.deals.length > 0) {
        for (const deal of dto.deals) {
          const dealData = await tx.deal.findFirst({
            where: {
              id: deal.dealId,
              restaurantId: dto.restaurantId,
            },
          });

          if (!dealData) {
            throw new NotFoundException(`Deal not found: ${deal.dealId}`);
          }

          if (!dealData.isAvailable) {
            throw new BadRequestException(`Deal unavailable: ${dealData.name}`);
          }

          const lineTotal = dealData.price.mul(deal.quantity);
          totalAmount = totalAmount.plus(lineTotal);

          await tx.orderDeal.create({
            data: {
              orderId: order.id,
              dealId: dealData.id,
              externalId: dealData.externalId, // Added externalId
              name: dealData.name,
              quantity: deal.quantity,
              price: dealData.price,
            },
          });
        }
      }

      // 6️⃣ Prevent Empty Orders
      if (totalAmount.equals(0)) {
        throw new BadRequestException('Order must contain items or deals');
      }

      // 7️⃣ Update Final Total
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          totalAmount,
        },
        include: {
          items: true,
          deals: true,
        },
      });

      return updatedOrder;
    });
  }

  // --- NEW: Fetch unsynced orders for POS ---
  async getUnsyncedOrders(apiKey: string) {
    // 1️⃣ Validate API Key
    if (!apiKey) {
      throw new BadRequestException('API key is required');
    }

    // 2️⃣ Find Restaurant
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { apiKey },
    });

    if (!restaurant) {
      throw new NotFoundException('Invalid API key');
    }

    // 3️⃣ Fetch Unsynced Orders
    const orders = await this.prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        isSynced: false,
      },
      include: {
        items: {
          select: {
            name: true,
            quantity: true,
            price: true,
            menuItem: {
              select: { externalId: true },
            },
          },
        },
        deals: {
          select: {
            name: true,
            quantity: true,
            price: true,
            deal: {
              select: { externalId: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // 4️⃣ Format Response (VERY IMPORTANT)
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      totalAmount: order.totalAmount.toFixed(2),
      status: order.status,
      street: order.street,
      city: order.city,
      state: order.state,
      zipCode: order.zipCode,
      country: order.country,

      items: order.items.map((i) => ({
        externalId: i.menuItem.externalId, // 🔥 correct mapping
        name: i.name,
        quantity: i.quantity,
        price: i.price.toFixed(2),
      })),

      deals: order.deals.map((d) => ({
        externalId: d.deal.externalId, // 🔥 correct mapping
        name: d.name,
        quantity: d.quantity,
        price: d.price.toFixed(2),
      })),
    }));

    // // 5️⃣ Mark as Synced (simple approach)
    // const orderIds = orders.map((o) => o.id);

    // if (orderIds.length > 0) {
    //   await this.prisma.order.updateMany({
    //     where: { id: { in: orderIds } },
    //     data: { isSynced: true },
    //   });
    // }

    return formattedOrders;
  }

  async acknowledgeOrders(apiKey: string, orderIds: string[]) {
    if (!apiKey) {
      throw new BadRequestException('API key is required');
    }

    if (!orderIds || orderIds.length === 0) {
      throw new BadRequestException('Order IDs are required');
    }

    // 1️⃣ Validate Restaurant
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { apiKey },
    });

    if (!restaurant) {
      throw new NotFoundException('Invalid API key');
    }

    // 2️⃣ Update ONLY this restaurant's orders (critical security)
    await this.prisma.order.updateMany({
      where: {
        id: { in: orderIds },
        restaurantId: restaurant.id,
      },
      data: {
        isSynced: true,
      },
    });

    return {
      message: 'Orders acknowledged successfully',
      count: orderIds.length,
    };
  }
}
