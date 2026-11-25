import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response.util.js';

const handleZodError = (res: Response, error: unknown, fallbackMessage: string): void => {
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    sendError(res, 'Validation failed', formattedErrors, 422);
    return;
  }
  sendError(res, fallbackMessage, null, 400);
};

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      handleZodError(res, error, 'Invalid request payload');
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as Request['query'];
      next();
    } catch (error) {
      handleZodError(res, error, 'Invalid query parameters');
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = (await schema.parseAsync(req.params)) as Request['params'];
      next();
    } catch (error) {
      handleZodError(res, error, 'Invalid route parameters');
    }
  };
};
