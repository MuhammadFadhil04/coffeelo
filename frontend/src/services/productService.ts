import { Product, Category } from '@/types';
import api from './api';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Semua Menu', slug: 'all', description: 'Kopi spesialti pilihan dan minuman racikan tangan barista.' },
  { id: 'espresso-black', name: 'Espresso & Kopi Hitam', slug: 'espresso-black', description: 'Ekstraksi espresso murni, americano, dan kopi hitam.' },
  { id: 'milk-latte', name: 'Kopi Susu & Latte', slug: 'milk-latte', description: 'Busa susu lembut berpadu dengan espresso spesialti.' },
  { id: 'signature', name: 'Racikan Andalan', slug: 'signature', description: 'Resep orisinal barista, perpaduan rasa, dan minuman dingin.' },
  { id: 'manual-brew', name: 'Seduh Manual (V60)', slug: 'manual-brew', description: 'Kopi saring asal tunggal yang diseduh segar per cangkir.' },
  { id: 'non-coffee', name: 'Non-Kopi & Teh', slug: 'non-coffee', description: 'Matcha artisan, cokelat murni, dan minuman botani.' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    categoryId: 'espresso-black',
    name: 'Reserve Cold Brew',
    slug: 'reserve-cold-brew',
    description: 'Biji kopi Ethiopia Yirgacheffe diekstraksi dingin selama 18 jam. Menghasilkan rasa buah persik manis, teh melati, dan cokelat gelap dengan body yang sangat bersih.',
    basePrice: 38000,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    ],
    stock: 40,
    isAvailable: true,
    isFeatured: true,
    tastingNotes: ['White Peach', 'Jasmine Tea', 'Brown Sugar'],
    roastLevel: 'Light',
    temperature: 'Iced',
    origin: 'Yirgacheffe, Ethiopia',
    altitude: '2,200m',
    process: 'Washed',
    scaScore: 88,
    rating: 4.9,
    reviewsCount: 38,
    nutrition: { calories: 5, caffeine: '165mg' },
    createdAt: '2026-01-10',
    variants: [
      { id: 'v1-1', productId: 'prod-1', name: 'Ukuran', optionValue: 'Reguler (12oz)', priceAdjustment: 0, stock: 40 },
      { id: 'v1-2', productId: 'prod-1', name: 'Ukuran', optionValue: 'Besar (16oz)', priceAdjustment: 8000, stock: 40 },
      { id: 'v1-3', productId: 'prod-1', name: 'Tingkat Es', optionValue: 'Es Normal', priceAdjustment: 0, stock: 40 },
      { id: 'v1-4', productId: 'prod-1', name: 'Tingkat Es', optionValue: 'Sedikit Es', priceAdjustment: 0, stock: 40 },
    ],
  },
  {
    id: 'prod-2',
    categoryId: 'signature',
    name: 'Caramel Macchiato',
    slug: 'caramel-macchiato',
    description: 'Susu segar bertekstur lembut dipadukan dengan double shot espresso dan saus salted caramel buatan rumah, disajikan dengan pola drizzle karamel di atas busa susu.',
    basePrice: 48000,
    imageUrl: 'https://images.unsplash.com/photo-1593443320739-77f74939d0da?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593443320739-77f74939d0da?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop',
    ],
    stock: 55,
    isAvailable: true,
    isFeatured: true,
    tastingNotes: ['Salted Caramel', 'Roasted Almond', 'Butterscotch'],
    roastLevel: 'Medium-Dark',
    temperature: 'Both',
    origin: 'Coffeelo House Blend (Brazil & Aceh Gayo)',
    altitude: '1,450m',
    process: 'Natural & Wet Hulled',
    scaScore: 86,
    rating: 4.9,
    reviewsCount: 64,
    nutrition: { calories: 190, caffeine: '140mg' },
    createdAt: '2026-01-12',
    variants: [
      { id: 'v2-1', productId: 'prod-2', name: 'Ukuran', optionValue: 'Reguler (8oz)', priceAdjustment: 0, stock: 55 },
      { id: 'v2-2', productId: 'prod-2', name: 'Ukuran', optionValue: 'Besar (12oz)', priceAdjustment: 8000, stock: 55 },
      { id: 'v2-3', productId: 'prod-2', name: 'Pilihan Susu', optionValue: 'Susu Segar', priceAdjustment: 0, stock: 55 },
      { id: 'v2-4', productId: 'prod-2', name: 'Pilihan Susu', optionValue: 'Susu Oat', priceAdjustment: 7500, stock: 55 },
      { id: 'v2-5', productId: 'prod-2', name: 'Tingkat Manis', optionValue: 'Normal (100%)', priceAdjustment: 0, stock: 55 },
      { id: 'v2-6', productId: 'prod-2', name: 'Tingkat Manis', optionValue: 'Sedikit Manis (50%)', priceAdjustment: 0, stock: 55 },
    ],
  },
  {
    id: 'prod-3',
    categoryId: 'milk-latte',
    name: 'Artisan Cappuccino',
    slug: 'artisan-cappuccino',
    description: 'Kombinasi klasik seimbang antara 1/3 espresso tebal, 1/3 steamed milk, dan 1/3 busa micro-foam tebal yang ditaburi bubuk kakao murni Jawa Timur.',
    basePrice: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop',
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    tastingNotes: ['Dark Cocoa', 'Walnut', 'Creamy Milk'],
    roastLevel: 'Medium',
    temperature: 'Hot',
    origin: 'Fazenda Santa Ines, Brazil',
    altitude: '1,100m',
    process: 'Pulped Natural',
    scaScore: 85,
    rating: 4.8,
    reviewsCount: 42,
    nutrition: { calories: 120, caffeine: '130mg' },
    createdAt: '2026-01-15',
    variants: [
      { id: 'v3-1', productId: 'prod-3', name: 'Ukuran', optionValue: 'Reguler (8oz)', priceAdjustment: 0, stock: 50 },
      { id: 'v3-2', productId: 'prod-3', name: 'Ukuran', optionValue: 'Besar (12oz)', priceAdjustment: 8000, stock: 50 },
      { id: 'v3-3', productId: 'prod-3', name: 'Pilihan Susu', optionValue: 'Susu Segar', priceAdjustment: 0, stock: 50 },
      { id: 'v3-4', productId: 'prod-3', name: 'Pilihan Susu', optionValue: 'Susu Oat', priceAdjustment: 7500, stock: 50 },
      { id: 'v3-5', productId: 'prod-3', name: 'Biji Kopi', optionValue: 'House Blend', priceAdjustment: 0, stock: 50 },
      { id: 'v3-6', productId: 'prod-3', name: 'Biji Kopi', optionValue: 'Asal Tunggal Ethiopia', priceAdjustment: 10000, stock: 50 },
    ],
  },
  {
    id: 'prod-4',
    categoryId: 'signature',
    name: 'Mocha Bliss',
    slug: 'mocha-bliss',
    description: 'Espresso Arabica dipadukan dengan lelehan cokelat hitam Belgia 72%, susu kukus bertekstur, dan taburan serpihan cokelat artisan.',
    basePrice: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=800&auto=format&fit=crop',
    stock: 45,
    isAvailable: true,
    isFeatured: true,
    tastingNotes: ['72% Belgian Chocolate', 'Black Cherry', 'Malt'],
    roastLevel: 'Dark',
    temperature: 'Both',
    origin: 'Colombia Huila & Belgian Callebaut',
    altitude: '1,650m',
    process: 'Washed',
    scaScore: 86.5,
    rating: 4.9,
    reviewsCount: 51,
    nutrition: { calories: 240, caffeine: '150mg' },
    createdAt: '2026-01-16',
    variants: [
      { id: 'v4-1', productId: 'prod-4', name: 'Ukuran', optionValue: 'Reguler (10oz)', priceAdjustment: 0, stock: 45 },
      { id: 'v4-2', productId: 'prod-4', name: 'Ukuran', optionValue: 'Besar (14oz)', priceAdjustment: 8000, stock: 45 },
      { id: 'v4-3', productId: 'prod-4', name: 'Pilihan Susu', optionValue: 'Susu Segar', priceAdjustment: 0, stock: 45 },
      { id: 'v4-4', productId: 'prod-4', name: 'Pilihan Susu', optionValue: 'Susu Oat', priceAdjustment: 7500, stock: 45 },
    ],
  },
  {
    id: 'prod-5',
    categoryId: 'espresso-black',
    name: 'Caffè Americano',
    slug: 'caffe-americano',
    description: 'Double shot espresso murni dituangkan di atas air mineral bersuhu 93°C dengan tekanan stabil. Crema tebal keemasan dengan rasa kacang panggang dan cedar.',
    basePrice: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    stock: 60,
    isAvailable: true,
    isFeatured: false,
    tastingNotes: ['Roasted Hazelnut', 'Cedar Wood', 'Dark Honey'],
    roastLevel: 'Medium-Dark',
    temperature: 'Both',
    origin: 'Bali Kintamani & Aceh Gayo',
    altitude: '1,300m',
    process: 'Fully Washed',
    scaScore: 84.5,
    rating: 4.7,
    reviewsCount: 30,
    nutrition: { calories: 5, caffeine: '150mg' },
    createdAt: '2026-01-18',
    variants: [
      { id: 'v5-1', productId: 'prod-5', name: 'Ukuran', optionValue: 'Reguler (8oz)', priceAdjustment: 0, stock: 60 },
      { id: 'v5-2', productId: 'prod-5', name: 'Ukuran', optionValue: 'Besar (12oz)', priceAdjustment: 6000, stock: 60 },
    ],
  },
  {
    id: 'prod-6',
    categoryId: 'signature',
    name: 'Vanilla Raf Coffee',
    slug: 'vanilla-raf-coffee',
    description: 'Minuman kopi legendaris Eropa Timur: single shot espresso disteam bersamaan dengan vanilla bean pod Madagaskar dan thick whipping cream segar.',
    basePrice: 42000,
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
    stock: 35,
    isAvailable: true,
    isFeatured: true,
    tastingNotes: ['Bourbon Vanilla', 'Sweet Buttercream', 'Crème Brûlée'],
    roastLevel: 'Medium',
    temperature: 'Hot',
    origin: 'Madagascar & Sumatra Mandheling',
    altitude: '1,500m',
    process: 'Wet Hulled',
    scaScore: 86,
    rating: 4.9,
    reviewsCount: 29,
    nutrition: { calories: 210, caffeine: '110mg' },
    createdAt: '2026-01-20',
    variants: [
      { id: 'v6-1', productId: 'prod-6', name: 'Ukuran', optionValue: 'Reguler (8oz)', priceAdjustment: 0, stock: 35 },
      { id: 'v6-2', productId: 'prod-6', name: 'Ukuran', optionValue: 'Besar (12oz)', priceAdjustment: 8000, stock: 35 },
      { id: 'v6-3', productId: 'prod-6', name: 'Tingkat Manis', optionValue: 'Normal (100%)', priceAdjustment: 0, stock: 35 },
      { id: 'v6-4', productId: 'prod-6', name: 'Tingkat Manis', optionValue: 'Sedikit Manis (50%)', priceAdjustment: 0, stock: 35 },
    ],
  },
  {
    id: 'prod-7',
    categoryId: 'milk-latte',
    name: 'Spanish Latte (Café Bombón)',
    slug: 'spanish-latte',
    description: 'Perpaduan sempurna antara condensed milk manis di dasar cangkir, espresso kental di tengah, dan micro-foam susu hangat di atasnya.',
    basePrice: 42000,
    imageUrl: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?q=80&w=800&auto=format&fit=crop',
    stock: 45,
    isAvailable: true,
    isFeatured: false,
    tastingNotes: ['Caramelized Condensed Milk', 'Roasted Almond', 'Milk Chocolate'],
    roastLevel: 'Medium-Dark',
    temperature: 'Both',
    origin: 'Coffeelo House Blend',
    altitude: '1,400m',
    process: 'Natural',
    scaScore: 85,
    rating: 4.8,
    reviewsCount: 33,
    nutrition: { calories: 230, caffeine: '140mg' },
    createdAt: '2026-01-22',
    variants: [
      { id: 'v7-1', productId: 'prod-7', name: 'Ukuran', optionValue: 'Reguler (10oz)', priceAdjustment: 0, stock: 45 },
      { id: 'v7-2', productId: 'prod-7', name: 'Ukuran', optionValue: 'Besar (14oz)', priceAdjustment: 8000, stock: 45 },
    ],
  },
  {
    id: 'prod-8',
    categoryId: 'manual-brew',
    name: 'Ethiopia Yirgacheffe V60',
    slug: 'ethiopia-yirgacheffe-v60',
    description: 'Diseduh manual cangkir demi cangkir dengan Hario V60 dripper. Kejernihan rasa luar biasa dengan aroma bunga melati, buah persik, dan aftertaste lemon segar.',
    basePrice: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
    stock: 25,
    isAvailable: true,
    isFeatured: true,
    tastingNotes: ['Bergamot Blossom', 'White Peach', 'Wild Flower Honey'],
    roastLevel: 'Light',
    temperature: 'Hot',
    origin: 'Koke, Yirgacheffe, Ethiopia',
    altitude: '2,200m',
    process: 'Washed Station',
    scaScore: 89.5,
    rating: 5.0,
    reviewsCount: 47,
    nutrition: { calories: 2, caffeine: '170mg' },
    createdAt: '2026-01-25',
    variants: [
      { id: 'v8-1', productId: 'prod-8', name: 'Gilingan', optionValue: 'V60 Sedang-Halus', priceAdjustment: 0, stock: 25 },
      { id: 'v8-2', productId: 'prod-8', name: 'Penyajian', optionValue: 'Cangkir Tunggal (250ml)', priceAdjustment: 0, stock: 25 },
      { id: 'v8-3', productId: 'prod-8', name: 'Penyajian', optionValue: 'Server Berbagi (500ml)', priceAdjustment: 25000, stock: 25 },
    ],
  },
  {
    id: 'prod-9',
    categoryId: 'non-coffee',
    name: 'Ceremonial Uji Matcha Latte',
    slug: 'ceremonial-uji-matcha-latte',
    description: 'Bubuk matcha ceremonial grade dari perkebunan Uji, Kyoto. Dikocek manual dengan chasen bambu dan dipadukan susu oat creamy tanpa rasa pahit berlebih.',
    basePrice: 46000,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop',
    stock: 35,
    isAvailable: true,
    isFeatured: true,
    tastingNotes: ['Umani Vegetal', 'Sweet Pistachio', 'Creamy Milk'],
    temperature: 'Both',
    origin: 'Uji, Kyoto, Japan',
    rating: 4.9,
    reviewsCount: 52,
    nutrition: { calories: 150, caffeine: '45mg' },
    createdAt: '2026-01-28',
    variants: [
      { id: 'v9-1', productId: 'prod-9', name: 'Ukuran', optionValue: 'Reguler (10oz)', priceAdjustment: 0, stock: 35 },
      { id: 'v9-2', productId: 'prod-9', name: 'Ukuran', optionValue: 'Besar (14oz)', priceAdjustment: 8000, stock: 35 },
      { id: 'v9-3', productId: 'prod-9', name: 'Pilihan Susu', optionValue: 'Susu Oat', priceAdjustment: 7500, stock: 35 },
      { id: 'v9-4', productId: 'prod-9', name: 'Pilihan Susu', optionValue: 'Susu Segar', priceAdjustment: 0, stock: 35 },
    ],
  },
  {
    id: 'prod-10',
    categoryId: 'milk-latte',
    name: 'Latte Macchiato',
    slug: 'latte-macchiato',
    description: 'Susu segar kukus berlapis espresso pekat yang menghasilkan gradasi tiga lapisan kopi lembut dan nikmat.',
    basePrice: 40000,
    imageUrl: 'https://images.unsplash.com/photo-1593443320739-77f74939d0da?q=80&w=800&auto=format&fit=crop',
    stock: 45,
    isAvailable: true,
    isFeatured: false,
    tastingNotes: ['Krim Susu Lembut', 'Karamel Ringan', 'Espresso Halus'],
    roastLevel: 'Medium',
    temperature: 'Hot',
    origin: 'Coffeelo House Blend',
    rating: 4.8,
    reviewsCount: 27,
    createdAt: '2026-01-29',
    variants: [
      { id: 'v10-1', productId: 'prod-10', name: 'Ukuran', optionValue: 'Reguler (8oz)', priceAdjustment: 0, stock: 45 },
      { id: 'v10-2', productId: 'prod-10', name: 'Ukuran', optionValue: 'Besar (12oz)', priceAdjustment: 8000, stock: 45 },
    ],
  },
  {
    id: 'prod-11',
    categoryId: 'signature',
    name: 'Frappuccino Crunch',
    slug: 'frappuccino-crunch',
    description: 'Espresso yang diblender bersama es batu, keping cokelat mocha, sentuhan hazelnut, dan krim kocok lembut.',
    basePrice: 50000,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop',
    stock: 30,
    isAvailable: true,
    isFeatured: false,
    tastingNotes: ['Mocha Crunch', 'Hazelnut Panggang', 'Krim Kocok'],
    roastLevel: 'Medium-Dark',
    temperature: 'Iced',
    origin: 'Coffeelo House Blend',
    rating: 4.8,
    reviewsCount: 34,
    createdAt: '2026-01-30',
    variants: [
      { id: 'v11-1', productId: 'prod-11', name: 'Ukuran', optionValue: 'Reguler (12oz)', priceAdjustment: 0, stock: 30 },
      { id: 'v11-2', productId: 'prod-11', name: 'Ukuran', optionValue: 'Besar (16oz)', priceAdjustment: 8000, stock: 30 },
    ],
  },
];

const formatApiProduct = (p: any): Product => {
  const fallback = PRODUCTS.find((item) => item.slug === p.slug);
  return {
    id: p.id,
    categoryId: p.categoryId,
    name: p.name,
    slug: p.slug,
    description: p.description,
    basePrice: Number(p.basePrice),
    imageUrl: p.imageUrl,
    images: p.images || [p.imageUrl],
    stock: p.stock ?? 0,
    isAvailable: p.isAvailable ?? true,
    isFeatured: p.isFeatured ?? false,
    category: p.category,
    variants: (p.variants || []).map((v: any) => ({
      id: v.id,
      productId: v.productId,
      name: v.name,
      optionValue: v.optionValue,
      priceAdjustment: Number(v.priceAdjustment),
      stock: v.stock ?? 50,
    })),
    tastingNotes: p.tastingNotes || fallback?.tastingNotes || ['Biji Spesialti', 'Sangrai Pilihan'],
    roastLevel: p.roastLevel || fallback?.roastLevel || 'Medium',
    temperature: p.temperature || fallback?.temperature || 'Both',
    origin: p.origin || fallback?.origin || 'Asal Tunggal',
    altitude: p.altitude || fallback?.altitude,
    process: p.process || fallback?.process,
    scaScore: p.scaScore || fallback?.scaScore,
    rating: p.rating || fallback?.rating || 4.8,
    reviewsCount: p.reviews?.length || p.reviewsCount || fallback?.reviewsCount || 12,
    nutrition: p.nutrition || fallback?.nutrition,
    createdAt: p.createdAt ? String(p.createdAt) : new Date().toISOString(),
  };
};

export const productService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await api.get('/categories');
      const apiCategories = res.data.data;
      if (Array.isArray(apiCategories) && apiCategories.length > 0) {
        return [
          { id: 'all', name: 'Semua Menu', slug: 'all', description: 'Kopi spesialti pilihan dan minuman racikan tangan barista.' },
          ...apiCategories.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description || undefined,
            imageUrl: c.imageUrl || undefined,
          })),
        ];
      }
    } catch (err) {
      console.warn('API getCategories error, using local fallback:', err);
    }
    return CATEGORIES;
  },

  getProducts: async (filters?: {
    categoryId?: string;
    searchQuery?: string;
    roastLevel?: string;
    temperature?: string;
    sortBy?: string;
    isFeatured?: boolean;
    isAvailable?: boolean;
  }): Promise<Product[]> => {
    try {
      let sortByParam = undefined;
      if (filters?.sortBy === 'price-asc') sortByParam = 'price_asc';
      else if (filters?.sortBy === 'price-desc') sortByParam = 'price_desc';
      else if (filters?.sortBy === 'name-asc') sortByParam = 'name';

      const res = await api.get('/products', {
        params: {
          categoryId: filters?.categoryId && filters.categoryId !== 'all' ? filters.categoryId : undefined,
          search: filters?.searchQuery?.trim() || undefined,
          isFeatured: filters?.isFeatured !== undefined ? String(filters.isFeatured) : undefined,
          isAvailable: filters?.isAvailable !== undefined ? String(filters.isAvailable) : 'true',
          sortBy: sortByParam,
          limit: 100,
        },
      });

      const apiData = res.data.data?.products || res.data.data;
      if (Array.isArray(apiData)) {
        let list: Product[] = apiData.map(formatApiProduct);

        if (filters?.roastLevel && filters.roastLevel !== 'all') {
          list = list.filter((p) => p.roastLevel === filters.roastLevel);
        }

        if (filters?.temperature && filters.temperature !== 'all') {
          list = list.filter((p) => p.temperature === filters.temperature || p.temperature === 'Both');
        }

        if (filters?.sortBy === 'featured') {
          list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }

        return list;
      }
    } catch (err) {
      console.warn('API getProducts error, using local fallback:', err);
    }

    // Fallback if API offline
    let result = [...PRODUCTS];

    if (filters?.isAvailable !== false) {
      result = result.filter((p) => p.isAvailable);
    }

    if (filters?.isFeatured !== undefined) {
      result = result.filter((p) => p.isFeatured === filters.isFeatured);
    }

    if (filters?.categoryId && filters.categoryId !== 'all') {
      result = result.filter(
        (p) =>
          p.categoryId === filters.categoryId ||
          p.category?.id === filters.categoryId ||
          p.category?.slug === filters.categoryId
      );
    }

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tastingNotes?.some((n) => n.toLowerCase().includes(q))
      );
    }

    if (filters?.roastLevel && filters.roastLevel !== 'all') {
      result = result.filter((p) => p.roastLevel === filters.roastLevel);
    }

    if (filters?.temperature && filters.temperature !== 'all') {
      result = result.filter(
        (p) => p.temperature === filters.temperature || p.temperature === 'Both'
      );
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.basePrice - b.basePrice);
          break;
        case 'price-desc':
          result.sort((a, b) => b.basePrice - a.basePrice);
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'featured':
        default:
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return result;
  },

  getProductBySlug: async (slug: string): Promise<Product | undefined> => {
    try {
      const res = await api.get(`/products/${slug}`);
      if (res.data.data) {
        return formatApiProduct(res.data.data);
      }
    } catch (err) {
      console.warn(`Product ${slug} API lookup error:`, err);
    }
    return PRODUCTS.find((p) => p.slug === slug || p.id === slug);
  },

  getRelatedProducts: async (currentProductId: string, categoryId: string): Promise<Product[]> => {
    try {
      const res = await api.get('/products', {
        params: { categoryId: categoryId !== 'all' ? categoryId : undefined, limit: 5 },
      });
      const apiData = res.data.data?.products || res.data.data;
      if (Array.isArray(apiData) && apiData.length > 0) {
        return apiData
          .filter((p: any) => p.id !== currentProductId && p.slug !== currentProductId)
          .slice(0, 3)
          .map(formatApiProduct);
      }
    } catch {}
    return PRODUCTS.filter((p) => p.id !== currentProductId && (p.categoryId === categoryId || p.category?.id === categoryId)).slice(0, 3);
  },
};
