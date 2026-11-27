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
    { name: 'Espresso & Kopi Hitam', slug: 'espresso-black', description: 'Ekstraksi espresso murni, americano, dan kopi hitam.' },
    { name: 'Kopi Susu & Latte', slug: 'milk-latte', description: 'Busa susu lembut berpadu dengan espresso spesialti.' },
    { name: 'Racikan Andalan', slug: 'signature', description: 'Resep orisinal barista, perpaduan rasa, dan minuman dingin.' },
    { name: 'Seduh Manual (V60)', slug: 'manual-brew', description: 'Kopi saring asal tunggal yang diseduh segar per cangkir.' },
    { name: 'Non-Kopi & Teh', slug: 'non-coffee', description: 'Matcha artisan, cokelat murni, dan minuman botani.' },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
      },
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
      basePrice: new Prisma.Decimal(38000),
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop',
      stock: 40,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: 'Ukuran', optionValue: 'Reguler (12oz)', priceAdjustment: new Prisma.Decimal(0), stock: 40 },
        { name: 'Ukuran', optionValue: 'Besar (16oz)', priceAdjustment: new Prisma.Decimal(8000), stock: 40 },
      ],
    },
    {
      categorySlug: 'signature',
      name: 'Caramel Macchiato',
      slug: 'caramel-macchiato',
      description: 'Susu segar bertekstur lembut dipadukan dengan double shot espresso dan saus salted caramel buatan rumah, disajikan dengan pola drizzle karamel di atas busa susu.',
      basePrice: new Prisma.Decimal(48000),
      imageUrl: 'https://images.unsplash.com/photo-1593443320739-77f74939d0da?q=80&w=800&auto=format&fit=crop',
      stock: 55,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: 'Ukuran', optionValue: 'Reguler (8oz)', priceAdjustment: new Prisma.Decimal(0), stock: 55 },
        { name: 'Ukuran', optionValue: 'Besar (12oz)', priceAdjustment: new Prisma.Decimal(8000), stock: 55 },
        { name: 'Pilihan Susu', optionValue: 'Susu Segar', priceAdjustment: new Prisma.Decimal(0), stock: 55 },
        { name: 'Pilihan Susu', optionValue: 'Susu Oat', priceAdjustment: new Prisma.Decimal(7500), stock: 55 },
      ],
    },
    {
      categorySlug: 'milk-latte',
      name: 'Artisan Cappuccino',
      slug: 'artisan-cappuccino',
      description: 'Kombinasi klasik seimbang antara 1/3 espresso tebal, 1/3 steamed milk, dan 1/3 busa micro-foam tebal yang ditaburi bubuk kakao murni Jawa Timur.',
      basePrice: new Prisma.Decimal(35000),
      imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop',
      stock: 50,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: 'Ukuran', optionValue: 'Reguler (8oz)', priceAdjustment: new Prisma.Decimal(0), stock: 50 },
        { name: 'Ukuran', optionValue: 'Besar (12oz)', priceAdjustment: new Prisma.Decimal(8000), stock: 50 },
      ],
    },
    {
      categorySlug: 'signature',
      name: 'Mocha Bliss',
      slug: 'mocha-bliss',
      description: 'Espresso Arabica dipadukan dengan lelehan cokelat hitam Belgia 72%, susu kukus bertekstur, dan taburan serpihan cokelat artisan.',
      basePrice: new Prisma.Decimal(45000),
      imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=800&auto=format&fit=crop',
      stock: 45,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: 'Ukuran', optionValue: 'Reguler (10oz)', priceAdjustment: new Prisma.Decimal(0), stock: 45 },
        { name: 'Ukuran', optionValue: 'Besar (14oz)', priceAdjustment: new Prisma.Decimal(8000), stock: 45 },
        { name: 'Pilihan Susu', optionValue: 'Susu Segar', priceAdjustment: new Prisma.Decimal(0), stock: 45 },
        { name: 'Pilihan Susu', optionValue: 'Susu Oat', priceAdjustment: new Prisma.Decimal(7500), stock: 45 },
      ],
    },
    {
      categorySlug: 'espresso-black',
      name: 'Caffè Americano',
      slug: 'caffe-americano',
      description: 'Double shot espresso murni dituangkan di atas air mineral bersuhu 93°C dengan tekanan stabil. Crema tebal keemasan dengan rasa kacang panggang dan cedar.',
      basePrice: new Prisma.Decimal(25000),
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
      stock: 60,
      isAvailable: true,
      isFeatured: false,
      variants: [
        { name: 'Ukuran', optionValue: 'Reguler (8oz)', priceAdjustment: new Prisma.Decimal(0), stock: 60 },
        { name: 'Ukuran', optionValue: 'Besar (12oz)', priceAdjustment: new Prisma.Decimal(6000), stock: 60 },
      ],
    },
    {
      categorySlug: 'signature',
      name: 'Vanilla Raf Coffee',
      slug: 'vanilla-raf-coffee',
      description: 'Minuman kopi legendaris Eropa Timur: single shot espresso disteam bersamaan dengan vanilla bean pod Madagaskar dan thick whipping cream segar.',
      basePrice: new Prisma.Decimal(42000),
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
      stock: 35,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: 'Ukuran', optionValue: 'Reguler (8oz)', priceAdjustment: new Prisma.Decimal(0), stock: 35 },
        { name: 'Ukuran', optionValue: 'Besar (12oz)', priceAdjustment: new Prisma.Decimal(8000), stock: 35 },
        { name: 'Tingkat Manis', optionValue: 'Normal (100%)', priceAdjustment: new Prisma.Decimal(0), stock: 35 },
        { name: 'Tingkat Manis', optionValue: 'Sedikit Manis (50%)', priceAdjustment: new Prisma.Decimal(0), stock: 35 },
      ],
    },
    {
      categorySlug: 'milk-latte',
      name: 'Spanish Latte (Café Bombón)',
      slug: 'spanish-latte',
      description: 'Perpaduan sempurna antara condensed milk manis di dasar cangkir, espresso kental di tengah, dan micro-foam susu hangat di atasnya.',
      basePrice: new Prisma.Decimal(42000),
      imageUrl: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?q=80&w=800&auto=format&fit=crop',
      stock: 45,
      isAvailable: true,
      isFeatured: false,
      variants: [
        { name: 'Ukuran', optionValue: 'Reguler (10oz)', priceAdjustment: new Prisma.Decimal(0), stock: 45 },
        { name: 'Ukuran', optionValue: 'Besar (14oz)', priceAdjustment: new Prisma.Decimal(8000), stock: 45 },
      ],
    },
    {
      categorySlug: 'manual-brew',
      name: 'Ethiopia Yirgacheffe V60',
      slug: 'ethiopia-yirgacheffe-v60',
      description: 'Diseduh manual cangkir demi cangkir dengan Hario V60 dripper. Kejernihan rasa luar biasa dengan aroma bunga melati, buah persik, dan aftertaste lemon segar.',
      basePrice: new Prisma.Decimal(45000),
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
      stock: 25,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: 'Gilingan', optionValue: 'V60 Sedang-Halus', priceAdjustment: new Prisma.Decimal(0), stock: 25 },
        { name: 'Penyajian', optionValue: 'Cangkir Tunggal (250ml)', priceAdjustment: new Prisma.Decimal(0), stock: 25 },
        { name: 'Penyajian', optionValue: 'Server Berbagi (500ml)', priceAdjustment: new Prisma.Decimal(25000), stock: 25 },
      ],
    },
    {
      categorySlug: 'non-coffee',
      name: 'Ceremonial Uji Matcha Latte',
      slug: 'ceremonial-uji-matcha-latte',
      description: 'Bubuk matcha ceremonial grade dari perkebunan Uji, Kyoto. Dikocek manual dengan chasen bambu dan dipadukan susu oat creamy tanpa rasa pahit berlebih.',
      basePrice: new Prisma.Decimal(46000),
      imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop',
      stock: 35,
      isAvailable: true,
      isFeatured: true,
      variants: [
        { name: 'Ukuran', optionValue: 'Reguler (10oz)', priceAdjustment: new Prisma.Decimal(0), stock: 35 },
        { name: 'Ukuran', optionValue: 'Besar (14oz)', priceAdjustment: new Prisma.Decimal(8000), stock: 35 },
        { name: 'Pilihan Susu', optionValue: 'Susu Oat', priceAdjustment: new Prisma.Decimal(7500), stock: 35 },
        { name: 'Pilihan Susu', optionValue: 'Susu Segar', priceAdjustment: new Prisma.Decimal(0), stock: 35 },
      ],
    },
    {
      categorySlug: 'milk-latte',
      name: 'Latte Macchiato',
      slug: 'latte-macchiato',
      description: 'Susu segar kukus berlapis espresso pekat yang menghasilkan gradasi tiga lapisan kopi lembut dan nikmat.',
      basePrice: new Prisma.Decimal(40000),
      imageUrl: 'https://images.unsplash.com/photo-1593443320739-77f74939d0da?q=80&w=800&auto=format&fit=crop',
      stock: 45,
      isAvailable: true,
      isFeatured: false,
      variants: [
        { name: 'Ukuran', optionValue: 'Reguler (8oz)', priceAdjustment: new Prisma.Decimal(0), stock: 45 },
        { name: 'Ukuran', optionValue: 'Besar (12oz)', priceAdjustment: new Prisma.Decimal(8000), stock: 45 },
      ],
    },
    {
      categorySlug: 'signature',
      name: 'Frappuccino Crunch',
      slug: 'frappuccino-crunch',
      description: 'Espresso yang diblender bersama es batu, keping cokelat mocha, sentuhan hazelnut, dan krim kocok lembut.',
      basePrice: new Prisma.Decimal(50000),
      imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop',
      stock: 30,
      isAvailable: true,
      isFeatured: false,
      variants: [
        { name: 'Ukuran', optionValue: 'Reguler (12oz)', priceAdjustment: new Prisma.Decimal(0), stock: 30 },
        { name: 'Ukuran', optionValue: 'Besar (16oz)', priceAdjustment: new Prisma.Decimal(8000), stock: 30 },
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
