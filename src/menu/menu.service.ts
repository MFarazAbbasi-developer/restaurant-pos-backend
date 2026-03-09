import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SyncMenuDto } from './dto/sync-menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async syncMenu(apiKey: string, data: SyncMenuDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Ensure restaurant exists
      // const restaurant = await tx.restaurant.upsert({
      //   where: { slug: data.restaurantSlug },
      //   update: {},
      //   create: { slug: data.restaurantSlug },
      // });

      const restaurant = await tx.restaurant.findUnique({
        where: { apiKey },
      });

      if (!restaurant) {
        throw new Error('Invalid API key');
      }

      const restaurantId = restaurant.id;

      // ===============================
      // 2️⃣ Sync Categories (Soft Sync)
      // ===============================

      const incomingCategoryIds = data.categories.map((c) => c.id);

      for (const category of data.categories) {
        await tx.category.upsert({
          where: {
            externalId_restaurantId: {
              externalId: category.id,
              restaurantId,
            },
          },
          update: {
            name: category.name,
            description: category.description,
            showInOrders: category.show_in_orders,
            rank: category.rank,
            isActive: true, // 🔥 Reactivate if previously disabled
          },
          create: {
            externalId: category.id,
            restaurantId,
            name: category.name,
            description: category.description,
            showInOrders: category.show_in_orders,
            rank: category.rank,
            isActive: true,
          },
        });
      }

      // Soft-disable removed categories
      await tx.category.updateMany({
        where: {
          restaurantId,
          externalId: { notIn: incomingCategoryIds },
        },
        data: {
          isActive: false,
        },
      });

      // ===============================
      // 3️⃣ Sync Menu Items (Soft Sync)
      // ===============================

      const incomingMenuItemIds = data.categories.flatMap((c) =>
        c.items.map((i) => i.id),
      );

      for (const category of data.categories) {
        const dbCategory = await tx.category.findUnique({
          where: {
            externalId_restaurantId: {
              externalId: category.id,
              restaurantId,
            },
          },
        });

        if (!dbCategory) {
          throw new Error(
            `Category with externalId ${category.id} not found for restaurant ${restaurantId}`,
          );
        }

        for (const item of category.items) {
          await tx.menuItem.upsert({
            where: {
              externalId_restaurantId: {
                externalId: item.id,
                restaurantId,
              },
            },
            update: {
              name: item.name,
              description: item.description,
              price: item.price,
              costPrice: item.cost_price,
              foodPandaPrice: item.food_panda_price,
              isAvailable: item.is_available, // POS controls availability
              imageUrl: item.image_url,
              weight: item.weight,
              unit: item.unit,
              rank: item.rank,
              categoryId: dbCategory.id,
            },
            create: {
              externalId: item.id,
              restaurantId,
              name: item.name,
              description: item.description,
              price: item.price,
              costPrice: item.cost_price,
              foodPandaPrice: item.food_panda_price,
              isAvailable: item.is_available,
              imageUrl: item.image_url,
              weight: item.weight,
              unit: item.unit,
              rank: item.rank,
              categoryId: dbCategory.id,
            },
          });
        }
      }

      // Soft-disable removed menu items
      await tx.menuItem.updateMany({
        where: {
          restaurantId,
          externalId: { notIn: incomingMenuItemIds },
        },
        data: {
          isAvailable: false,
        },
      });

      // ===============================
      // 4️⃣ Sync Deals (Soft Sync)
      // ===============================

      const incomingDealIds = data.deals.map((d) => d.id);

      for (const deal of data.deals) {
        const dbDeal = await tx.deal.upsert({
          where: {
            externalId_restaurantId: {
              externalId: deal.id,
              restaurantId,
            },
          },
          update: {
            name: deal.name,
            description: deal.description,
            price: deal.price,
            costPrice: deal.cost_price,
            foodPandaPrice: deal.food_panda_price,
            isAvailable: deal.is_available,
            imageUrl: deal.image_url,
            rank: deal.rank,
          },
          create: {
            externalId: deal.id,
            restaurantId,
            name: deal.name,
            description: deal.description,
            price: deal.price,
            costPrice: deal.cost_price,
            foodPandaPrice: deal.food_panda_price,
            isAvailable: deal.is_available,
            imageUrl: deal.image_url,
            rank: deal.rank,
          },
        });

        // Clear old deal items
        await tx.dealItem.deleteMany({
          where: { dealId: dbDeal.id },
        });

        // Recreate deal items
        for (const item of deal.items) {
          const dbMenuItem = await tx.menuItem.findUnique({
            where: {
              externalId_restaurantId: {
                externalId: item.menuItemId,
                restaurantId,
              },
            },
          });

          if (!dbMenuItem) continue;

          await tx.dealItem.create({
            data: {
              dealId: dbDeal.id,
              menuItemId: dbMenuItem.id,
              quantity: item.quantity,
            },
          });
        }
      }

      // Soft-disable removed deals
      await tx.deal.updateMany({
        where: {
          restaurantId,
          externalId: { notIn: incomingDealIds },
        },
        data: {
          isAvailable: false,
        },
      });

      return {
        status: 'success',
        message: 'Menu synced successfully',
      };
    });
  }
}
