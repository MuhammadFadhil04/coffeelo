import { Request, Response } from 'express';
import { productService } from '../services/product.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { resolveErrorStatus } from '../utils/app-error.util.js';

export class ProductController {
  async getAll(req: Request, res: Response) {
    try {
      const { categoryId, search, isFeatured, isAvailable, page, limit, sortBy } = req.query;

      const result = await productService.getAll({
        categoryId: categoryId as string,
        search: search as string,
        isFeatured: isFeatured !== undefined ? String(isFeatured) === 'true' : undefined,
        isAvailable: isAvailable !== undefined ? String(isAvailable) === 'true' : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy: sortBy as any,
      });

      return sendSuccess(res, result, 'Products retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch products.', null, resolveErrorStatus(error, 500));
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const product = await productService.getByIdOrSlug(id);
      return sendSuccess(res, product, 'Product detail retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Product not found.', null, resolveErrorStatus(error, 500));
    }
  }

  async create(req: Request, res: Response) {
    try {
      const product = await productService.create(req.body);
      return sendSuccess(res, product, 'Product created successfully.', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create product.', null, resolveErrorStatus(error, 500));
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const product = await productService.update(id, req.body);
      return sendSuccess(res, product, 'Product updated successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update product.', null, resolveErrorStatus(error, 500));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await productService.softDelete(id);
      return sendSuccess(res, null, 'Product deactivated successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to deactivate product.', null, resolveErrorStatus(error, 500));
    }
  }
}

export const productController = new ProductController();
