import { Request, Response } from 'express';
import { productService } from '../services/product.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class ProductController {
  async getAll(req: Request, res: Response) {
    try {
      const { categoryId, search, isFeatured, isAvailable, page, limit, sortBy } = req.query;

      const result = await productService.getAll({
        categoryId: categoryId as string,
        search: search as string,
        isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
        isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy: sortBy as any,
      });

      return sendSuccess(res, result, 'Products retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch products.', null, 500);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const product = await productService.getByIdOrSlug(id);
      return sendSuccess(res, product, 'Product detail retrieved successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Product not found.', null, 404);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const product = await productService.create(req.body);
      return sendSuccess(res, product, 'Product created successfully.', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create product.', null, 400);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const product = await productService.update(id, req.body);
      return sendSuccess(res, product, 'Product updated successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update product.', null, 400);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await productService.softDelete(id);
      return sendSuccess(res, null, 'Product deactivated successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to deactivate product.', null, 400);
    }
  }
}

export const productController = new ProductController();
