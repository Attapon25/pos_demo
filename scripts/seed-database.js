const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  // Seed products
  const products = await prisma.product.createMany({
    data: [
      { id: "prod_1", name: "ชาเขียว", price: 50, category: "ชา" },
      { id: "prod_2", name: "อเมริกาโน่", price: 50, category: "กาแฟ" },
      { id: "prod_3", name: "น้ำส้ม", price: 55, category: "น้ำผลไม้" },
      { id: "prod_4", name: "ชานมปั่น", price: 30, category: "ชา" },
      { id: "prod_5", name: "ชานมเย็น", price: 25, category: "ชา" },
    ],
  })

  console.log("Database seeded successfully!")
  console.log(`Created ${products.count} products`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
