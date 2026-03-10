import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  // Get all restaurants
  async findAll() {
    return this.prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        // city: true,
        // address: true,
        // isActive: true,
      },
      //   where: {
      //     isActive: true,
      //   },
    });
  }

  // Get menu of a restaurant
  async getRestaurantMenu(restaurantId: string) {
    return this.prisma.menuItem.findMany({
      where: {
        restaurantId: restaurantId,
        isAvailable: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
      },
    });
  }
}
