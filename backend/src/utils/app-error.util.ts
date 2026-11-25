import { Prisma } from '@prisma/client';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: unknown;

  constructor(message: string, statusCode = 400, errors: unknown = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const resolveErrorStatus = (error: unknown, fallbackStatus = 500): number => {
  if (error instanceof AppError) {
    return error.statusCode;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') return 404;
    if (error.code === 'P2002') return 409;
    if (error.code === 'P2003') return 400;
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    return 503;
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return 400;
  }

  if (error && typeof error === 'object') {
    const anyErr = error as { statusCode?: unknown; status?: unknown };
    if (typeof anyErr.statusCode === 'number' && anyErr.statusCode >= 400 && anyErr.statusCode < 600) {
      return anyErr.statusCode;
    }
    if (typeof anyErr.status === 'number' && anyErr.status >= 400 && anyErr.statusCode === undefined) {
      return anyErr.status;
    }
  }

  return fallbackStatus;
};
