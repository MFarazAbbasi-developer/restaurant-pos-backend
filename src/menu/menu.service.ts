import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SyncMenuDto } from './dto/create-menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async syncMenu(dto: SyncMenuDto) {
    // 1️⃣ Find or create restaurant
    let restaurant = await this.prisma.restaurant.findUnique({
      where: { slug: dto.restaurantSlug },
    });

    if (!restaurant) {
      restaurant = await this.prisma.restaurant.create({
        data: {
          name: dto.restaurantSlug, // or provide proper name
          slug: dto.restaurantSlug,
        },
      });
    }

    // 2️⃣ Upsert categories and items
    for (const cat of dto.categories) {
      const category = await this.prisma.category.upsert({
        where: { id: `${restaurant.id}-${cat.id}` }, // pseudo-id for uniqueness
        update: { name: cat.name, description: cat.description },
        create: {
          id: `${restaurant.id}-${cat.id}`,
          restaurantId: restaurant.id,
          name: cat.name,
          description: cat.description,
        },
      });

      for (const item of cat.items) {
        await this.prisma.menuItem.upsert({
          where: { id: `${category.id}-${item.id}` },
          update: {
            name: item.name,
            description: item.description,
            price: Number(item.price),
            isAvailable: item.is_available,
            imageUrl: item.image_url,
          },
          create: {
            id: `${category.id}-${item.id}`,
            categoryId: category.id,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            isAvailable: item.is_available,
            imageUrl: item.image_url,
          },
        });
      }
    }

    return { message: 'Menu synced successfully' };
  }
}
