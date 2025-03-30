// src/middlewares/logger.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { getCorrelationId } from '../utils/correlation-id';
import stringify from 'safe-stable-stringify';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const cid = getCorrelationId();
  const start = Date.now();

  const { method, originalUrl, body } = req;

  logger.info(`Request: [${method}] ${originalUrl}, Body: ${stringify(body)}`);

  const oldJson = res.json;
  res.json = function (data: any) {
    const duration = Date.now() - start;
    logger.info(`Response: ${method} ${originalUrl} → ${res.statusCode} (${duration}ms), Result: ${stringify(data)}`);
    return oldJson.call(this, data);
  };

  next();
};