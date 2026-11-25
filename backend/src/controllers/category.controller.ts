import { Request, Response } from 'express';
import { categoryService } from '../services/category.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { resolveErrorStatus } from '../utils/app-error.util.js';

export class CategoryController {
  async getAll(_req: Request, res: Response) {
    try {
      const categories = await categoryService.getAll();
      return sendSuccess(res, categories, 'Categories fetched successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch categories.', null, resolveErrorStatus(error, 500));
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const category = await categoryService.getById(id);
      return sendSuccess(res, category, 'Category fetched successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Category not found.', null, resolveErrorStatus(error, 500));
    }
  }

  async create(req: Request, res: Response) {
    try {
      const category = await categoryService.create(req.body);
      return sendSuccess(res, category, 'Category created successfully.', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create category.', null, resolveErrorStatus(error, 500));
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const category = await categoryService.update(id, req.body);
      return sendSuccess(res, category, 'Category updated successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update category.', null, resolveErrorStatus(error, 500));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await categoryService.delete(id);
      return sendSuccess(res, null, 'Category deleted successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to delete category.', null, resolveErrorStatus(error, 500));
    }
  }
}

export const categoryController = new CategoryController();
