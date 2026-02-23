import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with realistic data...');

  // Clear old data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.address.deleteMany();

  // --- Customers ---
  const customers = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Ali Khan', email: 'ali@example.com' },
  ];

  for (const c of customers) {
    const customer = await prisma.customer.create({
      data: {
        ...c,
        password: '$2b$10$examplehashedpassword', // bcrypt hash of 'password123'
      },
    });

    await prisma.address.createMany({
      data: [
        {
          customerId: customer.id,
          label: 'Home',
          line1: '101 Main Street',
          city: 'Karachi',
          latitude: 24.8607,
          longitude: 67.0011,
          isDefault: true,
        },
        {
          customerId: customer.id,
          label: 'Office',
          line1: '5th Avenue, Gulshan-e-Iqbal',
          city: 'Karachi',
          latitude: 24.861,
          longitude: 67.009,
        },
      ],
    });
  }

  // --- Restaurants ---
  const restaurantsData = [
    { name: 'Pizza Palace', slug: 'pizza-palace' },
    { name: 'Sushi World', slug: 'sushi-world' },
    { name: 'Burger Hub', slug: 'burger-hub' },
  ];

  for (const r of restaurantsData) {
    const restaurant = await prisma.restaurant.create({
      data: {
        ...r,
        description: `Delicious food from ${r.name}`,
      },
    });

    // Branches
    const branchesData = [
      {
        name: `${r.name} Main Branch`,
        addressLine1: '123 Main Street',
        city: 'Karachi',
        postalCode: '74400',
        country: 'Pakistan',
        phone: '+922134567890',
      },
      {
        name: `${r.name} Clifton Branch`,
        addressLine1: '45 Clifton Road',
        city: 'Karachi',
        postalCode: '75600',
        country: 'Pakistan',
        phone: '+922134567891',
      },
    ];

    for (const b of branchesData) {
      const branch = await prisma.branch.create({
        data: {
          ...b,
          restaurantId: restaurant.id,
        },
      });

      // Menu categories
      const categories = [
        'Pizzas',
        'Burgers',
        'Sushi Rolls',
        'Salads',
        'Desserts',
        'Drinks',
      ];

      for (const catName of categories) {
        const category = await prisma.menuCategory.create({
          data: {
            name: catName,
            position: 0,
            branchId: branch.id,
          },
        });

        // Menu items (example)
        let itemsData: Prisma.MenuItemCreateManyInput[] = [];

        if (catName === 'Pizzas') {
          itemsData = [
            {
              name: 'Margherita Pizza',
              price: new Prisma.Decimal(10.99),
              categoryId: category.id,
              isAvailable: true,
              position: 0,
            },
            {
              name: 'Pepperoni Pizza',
              price: new Prisma.Decimal(12.99),
              categoryId: category.id,
              isAvailable: true,
              position: 1,
            },
          ];
        } else if (catName === 'Burgers') {
          itemsData = [
            {
              name: 'Cheeseburger',
              price: new Prisma.Decimal(8.5),
              categoryId: category.id,
              isAvailable: true,
              position: 0,
            },
            {
              name: 'Veggie Burger',
              price: new Prisma.Decimal(7.5),
              categoryId: category.id,
              isAvailable: true,
              position: 1,
            },
          ];
        } else if (catName === 'Sushi Rolls') {
          itemsData = [
            {
              name: 'California Roll',
              price: new Prisma.Decimal(11.5),
              categoryId: category.id,
              isAvailable: true,
              position: 0,
            },
            {
              name: 'Salmon Nigiri',
              price: new Prisma.Decimal(13.0),
              categoryId: category.id,
              isAvailable: true,
              position: 1,
            },
          ];
        } else if (catName === 'Salads') {
          itemsData = [
            {
              name: 'Greek Salad',
              price: new Prisma.Decimal(6.5),
              categoryId: category.id,
              isAvailable: true,
              position: 0,
            },
            {
              name: 'Caesar Salad',
              price: new Prisma.Decimal(7.0),
              categoryId: category.id,
              isAvailable: true,
              position: 1,
            },
          ];
        } else if (catName === 'Desserts') {
          itemsData = [
            {
              name: 'Chocolate Cake',
              price: new Prisma.Decimal(5.0),
              categoryId: category.id,
              isAvailable: true,
              position: 0,
            },
            {
              name: 'Ice Cream Sundae',
              price: new Prisma.Decimal(4.5),
              categoryId: category.id,
              isAvailable: true,
              position: 1,
            },
          ];
        } else if (catName === 'Drinks') {
          itemsData = [
            {
              name: 'Coca Cola',
              price: new Prisma.Decimal(1.5),
              categoryId: category.id,
              isAvailable: true,
              position: 0,
            },
            {
              name: 'Orange Juice',
              price: new Prisma.Decimal(2.0),
              categoryId: category.id,
              isAvailable: true,
              position: 1,
            },
          ];
        }

        await prisma.menuItem.createMany({ data: itemsData });
      }
    }
  }

  console.log('Database seeded with realistic data!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
