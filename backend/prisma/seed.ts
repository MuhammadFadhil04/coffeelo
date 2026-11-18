import { PrismaClient, Role, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Coffeelo Database Seed...');

  // 1. Seed Users (Admin & Customer)
  const hashedAdminPassword = await bcrypt.hash('Admin123!', 10);
  const hashedCustomerPassword = await bcrypt.hash('Customer123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@coffeelo.com' },
    update: {},
    create: {
      name: 'Sheilla Poetri (Admin)',
      email: 'admin@coffeelo.com',
      password: hashedAdminPassword,
      phone: '+6281234567890',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      role: Role.ADMIN,
    },
  });
  console.log(`👤 Admin created: ${admin.email}`);

  const customer = await prisma.user.upsert({
    where: { email: 'customer@coffeelo.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer@coffeelo.com',
      password: hashedCustomerPassword,
      phone: '+628987654321',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      role: Role.CUSTOMER,
      addresses: {
        create: {
          recipientName: 'John Doe',
          phone: '+628987654321',
          addressLine: 'Jl. Senopati No. 88, Suite 4B',
          city: 'Jakarta Selatan',
          postalCode: '12190',
          isPrimary: true,
        },
      },
    },
  });
  console.log(`👤 Customer created: ${customer.email}`);

  // 2. Seed Categories
  const categoriesData = [
    { name: 'Espresso & Black', slug: 'espresso-black', description: 'Pure espresso extraction, americanos, and long extractions.' },
    { name: 'Milk Coffee & Lattes', slug: 'milk-latte', description: 'Smooth milk micro-foam balanced with specialty espresso.' },
    { name: 'Signature Creations', slug: 'signature', description: 'Barista original recipes, flavored infusions, and iced specials.' },
    { name: 'Manual Brew (V60)', slug: 'manual-brew', description: 'Single-origin filter coffee brewed fresh cup by cup.' },
    { name: 'Non-Coffee & Teas', slug: 'non-coffee', description: 'Artisan matcha, pure chocolate, and botanicals.' },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }
  console.log(`📁 ${categoriesData.length} categories seeded.`);

  // 3. Seed Products with Variants
  const productsData = [
    {
      categorySlug: 'espresso-black',
      name: 'Reserve Cold Brew',
      slug: 'reserve-cold-brew',
      description: 'Biji kopi Ethiopia Yirgacheffe diekstraksi dingin selama 18 jam. Menghasilkan rasa buah persik manis, teh melati, dan cokelat gelap dengan body yang sangat bersih.',
      basePrice: new Prisma.Decimal(3.80),
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop',
      stock: 40,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: 'Size', optionValue: 'Regular (12oz)', priceAdjustment: new Prisma.Decimal(0), stock: 40 },
        { name: 'Size', optionValue: 'Large (16oz)', priceAdjustment: new Prisma.Decimal(0.80), stock: 40 },
      ],
    },
    {
      categorySlug: 'signature',
      name: 'Caramel Macchiato',
      slug: 'caramel-macchiato',
      description: 'Susu segar bertekstur lembut dipadukan dengan double shot espresso dan saus salted caramel buatan rumah, disajikan dengan pola drizzle karamel di atas busa susu.',
      basePrice: new Prisma.Decimal(4.80),
      imageUrl: 'https://images.unsplash.com/photo-1593443320739-77f74939d0da?q=80&w=800&auto=format&fit=crop',
      stock: 55,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: 'Size', optionValue: 'Regular (8oz)', priceAdjustment: new Prisma.Decimal(0), stock: 55 },
        { name: 'Size', optionValue: 'Large (12oz)', priceAdjustment: new Prisma.Decimal(0.80), stock: 55 },
        { name: 'Milk Option', optionValue: 'Fresh Whole Dairy', priceAdjustment: new Prisma.Decimal(0), stock: 55 },
        { name: 'Milk Option', optionValue: 'Oatly Oat Milk', priceAdjustment: new Prisma.Decimal(0.75), stock: 55 },
      ],
    },
    {
      categorySlug: 'milk-latte',
      name: 'Artisan Cappuccino',
      slug: 'artisan-cappuccino',
      description: 'Kombinasi klasik seimbang antara 1/3 espresso tebal, 1/3 steamed milk, dan 1/3 busa micro-foam tebal yang ditaburi bubuk kakao murni Jawa Timur.',
      basePrice: new Prisma.Decimal(3.50),
      imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop',
      stock: 50,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: 'Size', optionValue: 'Regular (8oz)', priceAdjustment: new Prisma.Decimal(0), stock: 50 },
        { name: 'Size', optionValue: 'Large (12oz)', priceAdjustment: new Prisma.Decimal(0.80), stock: 50 },
      ],
    },
  ];

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        categoryId,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        basePrice: prod.basePrice,
        imageUrl: prod.imageUrl,
        stock: prod.stock,
        isAvailable: prod.isAvailable,
        isFeatured: prod.isFeatured,
        variants: {
          create: prod.variants,
        },
      },
    });
  }

  console.log('✅ Coffeelo Database Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
