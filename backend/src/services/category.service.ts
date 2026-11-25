import prisma from '../config/database.js';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator.js';
import { AppError } from '../utils/app-error.util.js';

export class CategoryService {
  async getAll() {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { deletedAt: null },
        },
      },
    });

    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    return category;
  }

  async create(data: CreateCategoryInput) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new AppError(`Category with slug "${slug}" already exists.`, 409);
    }

    return await prisma.category.create({
      data: {
        name: data.name.trim(),
        slug,
        description: data.description?.trim(),
        imageUrl: data.imageUrl,
      },
    });
  }

  async update(id: string, data: UpdateCategoryInput) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    let slug = data.slug;
    if (data.name && !slug) {
      slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (slug && slug !== category.slug) {
      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) {
        throw new AppError(`Category with slug "${slug}" already exists.`, 409);
      }
    }

    return await prisma.category.update({
      where: { id },
      data: {
        name: data.name ? data.name.trim() : undefined,
        slug,
        description: data.description !== undefined ? data.description?.trim() : undefined,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : undefined,
      },
    });
  }

  async delete(id: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    const productCount = await prisma.product.count({
      where: { categoryId: id, deletedAt: null },
    });

    if (productCount > 0) {
      throw new AppError(`Cannot delete category with ${productCount} active products.`, 409);
    }

    return await prisma.category.delete({ where: { id } });
  }
}

export const categoryService = new CategoryService();
