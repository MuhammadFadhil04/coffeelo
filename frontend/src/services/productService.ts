import { Product, Category } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Menu', slug: 'all', description: 'Curated specialty coffees and handcrafted beverages.' },
  { id: 'espresso-black', name: 'Espresso & Black', slug: 'espresso-black', description: 'Pure espresso extraction, americanos, and long extractions.' },
  { id: 'milk-latte', name: 'Milk Coffee & Lattes', slug: 'milk-latte', description: 'Smooth milk micro-foam balanced with specialty espresso.' },
  { id: 'signature', name: 'Signature Creations', slug: 'signature', description: 'Barista original recipes, flavored infusions, and iced specials.' },
  { id: 'manual-brew', name: 'Manual Brew (V60)', slug: 'manual-brew', description: 'Single-origin filter coffee brewed fresh cup by cup.' },
  { id: 'non-coffee', name: 'Non-Coffee & Teas', slug: 'non-coffee', description: 'Artisan matcha, pure chocolate, and botanicals.' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    categoryId: 'espresso-black',
    name: 'Reserve Cold Brew',
    slug: 'reserve-cold-brew',
    description: 'Biji kopi Ethiopia Yirgacheffe diekstraksi dingin selama 18 jam. Menghasilkan rasa buah persik manis, teh melati, dan cokelat gelap dengan body yang sangat bersih.',
    basePrice: 3.80,
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
      { id: 'v1-1', productId: 'prod-1', name: 'Size', optionValue: 'Regular (12oz)', priceAdjustment: 0, stock: 40 },
      { id: 'v1-2', productId: 'prod-1', name: 'Size', optionValue: 'Large (16oz)', priceAdjustment: 0.80, stock: 40 },
      { id: 'v1-3', productId: 'prod-1', name: 'Ice Level', optionValue: 'Normal Ice', priceAdjustment: 0, stock: 40 },
      { id: 'v1-4', productId: 'prod-1', name: 'Ice Level', optionValue: 'Less Ice', priceAdjustment: 0, stock: 40 },
    ],
  },
  {
    id: 'prod-2',
    categoryId: 'signature',
    name: 'Caramel Macchiato',
    slug: 'caramel-macchiato',
    description: 'Susu segar bertekstur lembut dipadukan dengan double shot espresso dan saus salted caramel buatan rumah, disajikan dengan pola drizzle karamel di atas busa susu.',
    basePrice: 4.80,
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
      { id: 'v2-1', productId: 'prod-2', name: 'Size', optionValue: 'Regular (8oz)', priceAdjustment: 0, stock: 55 },
      { id: 'v2-2', productId: 'prod-2', name: 'Size', optionValue: 'Large (12oz)', priceAdjustment: 0.80, stock: 55 },
      { id: 'v2-3', productId: 'prod-2', name: 'Milk Option', optionValue: 'Fresh Whole Dairy', priceAdjustment: 0, stock: 55 },
      { id: 'v2-4', productId: 'prod-2', name: 'Milk Option', optionValue: 'Oatly Oat Milk', priceAdjustment: 0.75, stock: 55 },
      { id: 'v2-5', productId: 'prod-2', name: 'Sweetness', optionValue: 'Normal Sweet (100%)', priceAdjustment: 0, stock: 55 },
      { id: 'v2-6', productId: 'prod-2', name: 'Sweetness', optionValue: 'Less Sweet (50%)', priceAdjustment: 0, stock: 55 },
    ],
  },
  {
    id: 'prod-3',
    categoryId: 'milk-latte',
    name: 'Artisan Cappuccino',
    slug: 'artisan-cappuccino',
    description: 'Kombinasi klasik seimbang antara 1/3 espresso tebal, 1/3 steamed milk, dan 1/3 busa micro-foam tebal yang ditaburi bubuk kakao murni Jawa Timur.',
    basePrice: 3.50,
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
      { id: 'v3-1', productId: 'prod-3', name: 'Size', optionValue: 'Regular (8oz)', priceAdjustment: 0, stock: 50 },
      { id: 'v3-2', productId: 'prod-3', name: 'Size', optionValue: 'Large (12oz)', priceAdjustment: 0.80, stock: 50 },
      { id: 'v3-3', productId: 'prod-3', name: 'Milk Option', optionValue: 'Whole Dairy', priceAdjustment: 0, stock: 50 },
      { id: 'v3-4', productId: 'prod-3', name: 'Milk Option', optionValue: 'Oat Milk', priceAdjustment: 0.75, stock: 50 },
      { id: 'v3-5', productId: 'prod-3', name: 'Beans', optionValue: 'House Blend', priceAdjustment: 0, stock: 50 },
      { id: 'v3-6', productId: 'prod-3', name: 'Beans', optionValue: 'Single Origin Ethiopia (+1.00)', priceAdjustment: 1.00, stock: 50 },
    ],
  },
  {
    id: 'prod-4',
    categoryId: 'signature',
    name: 'Mocha Bliss',
    slug: 'mocha-bliss',
    description: 'Espresso Arabica dipadukan dengan lelehan cokelat hitam Belgia 72%, susu kukus bertekstur, dan taburan serpihan cokelat artisan.',
    basePrice: 4.50,
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
      { id: 'v4-1', productId: 'prod-4', name: 'Size', optionValue: 'Regular (10oz)', priceAdjustment: 0, stock: 45 },
      { id: 'v4-2', productId: 'prod-4', name: 'Size', optionValue: 'Large (14oz)', priceAdjustment: 0.80, stock: 45 },
      { id: 'v4-3', productId: 'prod-4', name: 'Milk Option', optionValue: 'Whole Milk', priceAdjustment: 0, stock: 45 },
      { id: 'v4-4', productId: 'prod-4', name: 'Milk Option', optionValue: 'Oat Milk', priceAdjustment: 0.75, stock: 45 },
    ],
  },
  {
    id: 'prod-5',
    categoryId: 'espresso-black',
    name: 'Caffè Americano',
    slug: 'caffe-americano',
    description: 'Double shot espresso murni dituangkan di atas air mineral bersuhu 93°C dengan tekanan stabil. Crema tebal keemasan dengan rasa kacang panggang dan cedar.',
    basePrice: 2.50,
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
      { id: 'v5-1', productId: 'prod-5', name: 'Size', optionValue: 'Regular (8oz)', priceAdjustment: 0, stock: 60 },
      { id: 'v5-2', productId: 'prod-5', name: 'Size', optionValue: 'Large (12oz)', priceAdjustment: 0.60, stock: 60 },
    ],
  },
  {
    id: 'prod-6',
    categoryId: 'signature',
    name: 'Vanilla Raf Coffee',
    slug: 'vanilla-raf-coffee',
    description: 'Minuman kopi legendaris Eropa Timur: single shot espresso disteam bersamaan dengan vanilla bean pod Madagaskar dan thick whipping cream segar.',
    basePrice: 4.20,
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
      { id: 'v6-1', productId: 'prod-6', name: 'Size', optionValue: 'Regular (8oz)', priceAdjustment: 0, stock: 35 },
      { id: 'v6-2', productId: 'prod-6', name: 'Size', optionValue: 'Large (12oz)', priceAdjustment: 0.80, stock: 35 },
      { id: 'v6-3', productId: 'prod-6', name: 'Sweetness', optionValue: 'Normal (100%)', priceAdjustment: 0, stock: 35 },
      { id: 'v6-4', productId: 'prod-6', name: 'Sweetness', optionValue: 'Less Sweet (50%)', priceAdjustment: 0, stock: 35 },
    ],
  },
  {
    id: 'prod-7',
    categoryId: 'milk-latte',
    name: 'Spanish Latte (Café Bombón)',
    slug: 'spanish-latte',
    description: 'Perpaduan sempurna antara condensed milk manis di dasar cangkir, espresso kental di tengah, dan micro-foam susu hangat di atasnya.',
    basePrice: 4.20,
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
      { id: 'v7-1', productId: 'prod-7', name: 'Size', optionValue: 'Regular (10oz)', priceAdjustment: 0, stock: 45 },
      { id: 'v7-2', productId: 'prod-7', name: 'Size', optionValue: 'Large (14oz)', priceAdjustment: 0.80, stock: 45 },
    ],
  },
  {
    id: 'prod-8',
    categoryId: 'manual-brew',
    name: 'Ethiopia Yirgacheffe V60',
    slug: 'ethiopia-yirgacheffe-v60',
    description: 'Diseduh manual cangkir demi cangkir dengan Hario V60 dripper. Kejernihan rasa luar biasa dengan aroma bunga melati, buah persik, dan aftertaste lemon segar.',
    basePrice: 4.50,
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
      { id: 'v8-1', productId: 'prod-8', name: 'Grind Size', optionValue: 'V60 Medium-Fine', priceAdjustment: 0, stock: 25 },
      { id: 'v8-2', productId: 'prod-8', name: 'Serving Style', optionValue: 'Single Cup (250ml)', priceAdjustment: 0, stock: 25 },
      { id: 'v8-3', productId: 'prod-8', name: 'Serving Style', optionValue: 'Sharing Server (500ml)', priceAdjustment: 3.50, stock: 25 },
    ],
  },
  {
    id: 'prod-9',
    categoryId: 'non-coffee',
    name: 'Ceremonial Uji Matcha Latte',
    slug: 'ceremonial-uji-matcha-latte',
    description: 'Bubuk matcha ceremonial grade dari perkebunan Uji, Kyoto. Dikocek manual dengan chasen bambu dan dipadukan susu oat creamy tanpa rasa pahit berlebih.',
    basePrice: 4.60,
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
      { id: 'v9-1', productId: 'prod-9', name: 'Size', optionValue: 'Regular (10oz)', priceAdjustment: 0, stock: 35 },
      { id: 'v9-2', productId: 'prod-9', name: 'Size', optionValue: 'Large (14oz)', priceAdjustment: 0.80, stock: 35 },
      { id: 'v9-3', productId: 'prod-9', name: 'Milk Option', optionValue: 'Oatly Oat Milk', priceAdjustment: 0.75, stock: 35 },
      { id: 'v9-4', productId: 'prod-9', name: 'Milk Option', optionValue: 'Dairy Whole Milk', priceAdjustment: 0, stock: 35 },
    ],
  },
];

export const productService = {
  getCategories: async (): Promise<Category[]> => {
    return CATEGORIES;
  },

  getProducts: async (filters?: {
    categoryId?: string;
    searchQuery?: string;
    roastLevel?: string;
    temperature?: string;
    sortBy?: string;
  }): Promise<Product[]> => {
    let result = [...PRODUCTS];

    if (filters?.categoryId && filters.categoryId !== 'all') {
      result = result.filter((p) => p.categoryId === filters.categoryId);
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
    return PRODUCTS.find((p) => p.slug === slug);
  },

  getRelatedProducts: async (currentProductId: string, categoryId: string): Promise<Product[]> => {
    return PRODUCTS.filter((p) => p.id !== currentProductId && p.categoryId === categoryId).slice(0, 3);
  },
};
