import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.menuItem.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.admin.deleteMany({})

  console.log('🧹 Clearing database...')

  // Create Admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: 'Super Admin',
    },
  })
  console.log('✅ Admin created (username: admin, password: admin123)')

  // Create Categories
  const categories = [
    { name: 'Makanan Utama', slug: 'makanan-utama' },
    { name: 'Mie & Noodle', slug: 'mie-noodle' },
    { name: 'Snack & Side', slug: 'snack-side' },
    { name: 'Minuman Segar', slug: 'minuman-segar' },
    { name: 'Kopi & Latte', slug: 'kopi-latte' },
    { name: 'Dessert', slug: 'dessert' },
  ]

  for (const cat of categories) {
    await prisma.category.create({ data: cat })
  }
  console.log('✅ Categories created')

  const catList = await prisma.category.findMany()
  const findCat = (slug: string) => catList.find((c: any) => c.slug === slug)?.id || 1

  // Create Menu Items
  const menuItems = [
    {
      name: 'Nasi Goreng Spesial',
      description: 'Nasi goreng dengan telur, sosis, bakso, dan bumbu rempah rahasia.',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1512058560566-427493b03335?q=80&w=800',
      categoryId: findCat('makanan-utama'),
    },
    {
      name: 'Ayam Bakar Madu',
      description: 'Ayam bakar dengan bumbu madu manis gurih disajikan dengan sambal terasi.',
      price: 32000,
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800',
      categoryId: findCat('makanan-utama'),
    },
    {
      name: 'Nasi Rendang',
      description: 'Rendang daging sapi empuk dengan nasi pulen dan lauk pauk.',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?q=80&w=800',
      categoryId: findCat('makanan-utama'),
    },
    {
      name: 'Mie Goreng Seafood',
      description: 'Mie goreng dengan udang, cumi, dan potongan ikan segar.',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800',
      categoryId: findCat('mie-noodle'),
    },
    {
      name: 'Ramen Spicy',
      description: 'Ramen pedas ala Jepang dengan kaldu rich dan topping lengkap.',
      price: 30000,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800',
      categoryId: findCat('mie-noodle'),
    },
    {
      name: 'Kentang Goreng Keju',
      description: 'Kentang goreng renyah dengan taburan keju parmesan.',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800',
      categoryId: findCat('snack-side'),
    },
    {
      name: 'Chicken Wings BBQ',
      description: 'Sayap ayam crispy dengan saus BBQ smoky.',
      price: 22000,
      image: 'https://images.unsplash.com/photo-1608039829572-9479e1e4e63e?q=80&w=800',
      categoryId: findCat('snack-side'),
    },
    {
      name: 'Es Teh Manis',
      description: 'Teh melati seduh segar dengan es batu.',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800',
      categoryId: findCat('minuman-segar'),
    },
    {
      name: 'Jus Alpukat',
      description: 'Jus alpukat creamy segar dengan susu kental manis.',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=800',
      categoryId: findCat('minuman-segar'),
    },
    {
      name: 'Es Kopi Susu Aren',
      description: 'Espresso dengan susu dan gula aren asli.',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=800',
      categoryId: findCat('kopi-latte'),
    },
    {
      name: 'Matcha Latte',
      description: 'Teh hijau jepang berkualitas dengan susu creamy.',
      price: 22000,
      image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=800',
      categoryId: findCat('kopi-latte'),
    },
    {
      name: 'Brownies Coklat',
      description: 'Brownies coklat fudgy dengan topping whipped cream.',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?q=80&w=800',
      categoryId: findCat('dessert'),
    },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item })
  }
  console.log('✅ Menu items created')

  console.log('\n🎉 Seeding finished!')
  console.log('📋 Admin login: username = admin, password = admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
