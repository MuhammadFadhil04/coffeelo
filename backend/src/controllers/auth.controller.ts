import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      return sendSuccess(res, result, 'Registration successful. Welcome to Coffeelo!', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Registration failed.', null, 400);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, result, 'Login successful.');
    } catch (error: any) {
      return sendError(res, error.message || 'Login failed.', null, 401);
    }
  }

  async me(req: Request, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Unauthenticated', null, 401);
      }
      const profile = await authService.getProfile(req.user.id);
      return sendSuccess(res, profile, 'Profile fetched successfully.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch profile.', null, 400);
    }
  }
}

export const authController = new AuthController();
