import prisma from '../config/database.js';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validator.js';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/app-error.util.js';

export interface ProductQueryFilters {
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name';
}

export class ProductService {
  async getAll(filters?: ProductQueryFilters) {
    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters?.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    if (filters?.categoryId && filters.categoryId !== 'all') {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(filters.categoryId);
      if (isUuid) {
        where.categoryId = filters.categoryId;
      } else {
        where.category = { slug: filters.categoryId };
      }
    }

    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters?.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable;
    }

    if (filters?.search) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters?.sortBy === 'price_asc') {
      orderBy = { basePrice: 'asc' };
    } else if (filters?.sortBy === 'price_desc') {
      orderBy = { basePrice: 'desc' };
    } else if (filters?.sortBy === 'name') {
      orderBy = { name: 'asc' };
    }

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getByIdOrSlug(identifier: string) {
    // Check if identifier is UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          isUuid ? { id: identifier } : { slug: identifier },
          { slug: identifier },
        ],
        deletedAt: null,
      },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    return product;
  }

  async create(data: CreateProductInput) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      throw new AppError('Selected category does not exist.', 404);
    }
    let slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    return await prisma.product.create({
      data: {
        categoryId: data.categoryId,
        name: data.name.trim(),
        slug,
        description: data.description.trim(),
        basePrice: new Prisma.Decimal(data.basePrice),
        imageUrl: data.imageUrl,
        stock: data.stock ?? 0,
        isAvailable: data.isAvailable ?? true,
        isFeatured: data.isFeatured ?? false,
        variants: data.variants && data.variants.length > 0 ? {
          create: data.variants.map((v) => ({
            name: v.name.trim(),
            optionValue: v.optionValue.trim(),
            priceAdjustment: new Prisma.Decimal(v.priceAdjustment ?? 0),
            stock: v.stock ?? 50,
          })),
        } : undefined,
      },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  async update(id: string, data: UpdateProductInput) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.deletedAt) {
      throw new AppError('Product not found.', 404);
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) {
        throw new AppError('Selected category does not exist.', 404);
      }
    }

    let slug = data.slug;
    if (data.name && !slug) {
      slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (slug && slug !== product.slug) {
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) {
        throw new AppError(`Product with slug "${slug}" already exists.`, 409);
      }
    }

    return await prisma.$transaction(async (tx) => {
      if (data.variants !== undefined) {
        const keepIds = data.variants
          .map((v) => v.id)
          .filter((vid): vid is string => Boolean(vid));

        await tx.productVariant.deleteMany({
          where: {
            productId: id,
            ...(keepIds.length > 0 ? { id: { notIn: keepIds } } : {}),
          },
        });

        for (const v of data.variants) {
          const variantPayload = {
            name: v.name.trim(),
            optionValue: v.optionValue.trim(),
            priceAdjustment: new Prisma.Decimal(v.priceAdjustment ?? 0),
            stock: v.stock ?? 50,
          };

          if (v.id) {
            const updated = await tx.productVariant.updateMany({
              where: { id: v.id, productId: id },
              data: variantPayload,
            });
            if (updated.count === 0) {
              await tx.productVariant.create({
                data: { productId: id, ...variantPayload },
              });
            }
          } else {
            await tx.productVariant.create({
              data: { productId: id, ...variantPayload },
            });
          }
        }
      }

      return await tx.product.update({
        where: { id },
        data: {
          categoryId: data.categoryId,
          name: data.name?.trim(),
          slug,
          description: data.description?.trim(),
          basePrice: data.basePrice !== undefined ? new Prisma.Decimal(data.basePrice) : undefined,
          imageUrl: data.imageUrl,
          stock: data.stock,
          isAvailable: data.isAvailable,
          isFeatured: data.isFeatured,
        },
        include: {
          category: true,
          variants: true,
        },
      });
    });
  }

  async softDelete(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.deletedAt) {
      throw new AppError('Product not found.', 404);
    }

    return await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isAvailable: false,
      },
    });
  }
}

export const productService = new ProductService();
