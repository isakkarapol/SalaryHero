// src/utils/with-log-fn.ts

import { logger } from './logger';
import stringify from 'safe-stable-stringify';
import { BaseException } from '../errors/base.error';

export function withLogFn<T extends (...args: any[]) => Promise<any>>(name: string, fn: T): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const start = Date.now();
    const safeArgs = args.map((arg) => {
      if (arg && typeof arg === 'object') {
        if ('body' in arg) return { body: arg.body };
        if ('statusCode' in arg) return '[Response Object]';
        if (typeof arg === 'function') return '[NextFunction]';
      }
      return arg;
    });

    logger.info(`Start: ${name}, Args: ${stringify(safeArgs)}`);

    try {
      const result = await fn(...args);
      const duration = Date.now() - start;
      logger.info(`End: ${name}, (${duration}ms), Result : ${stringify(result)}`);
      return result;
    } catch (err: any) {
      const duration = Date.now() - start;

      if (err instanceof BaseException) {
        logger.warn(`Warn: ${name}, (${duration}ms), Validation: ${err.message}`);
      } else {
        logger.error(`Error: ${name}, (${duration}ms), Message: ${err.message}`);
      }

      const next = args[2] as any;
      if (typeof next === 'function') {
        return next(err);
      }

      throw err;
    }
  }) as T;
}