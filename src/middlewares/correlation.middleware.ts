// src/middlewares/correlation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { setCorrelationId } from '../utils/correlation-id';
import { v4 as uuidv4 } from 'uuid';

export const correlationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const incomingCid = req.headers['x-correlation-id'] as string;
  const cid = incomingCid || uuidv4();

  res.setHeader('x-correlation-id', cid);

  setCorrelationId(cid, () => {
    next();
  });
};