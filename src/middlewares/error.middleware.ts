// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { BaseException } from '../errors/base.error';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof BaseException) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(`Unhandled Error: ${err.stack || err}`);
  res.status(500).json({ error: 'Internal Server Error' });
}