// scripts/fix-api-keys.ts

import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

function generateApiKey() {
  return "sk_live_" + randomBytes(24).toString("hex");
}

async function main() {
  const restaurants = await prisma.restaurant.findMany()

  for (const restaurant of restaurants) {
    if (!restaurant.apiKey) {
      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { apiKey: generateApiKey() }
      })
    }
  }

  console.log("API keys generated.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())