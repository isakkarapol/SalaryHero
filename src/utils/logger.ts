// src/utils/logger.ts

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { getCorrelationId } from './correlation-id';

const logDir = path.resolve(__dirname, '../../logs');

const transport = new DailyRotateFile({
  filename: 'app-%DATE%.log',
  dirname: logDir,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.printf(({ timestamp, level, message }) => {
      const correlationId = getCorrelationId();
      const cid = correlationId ? ` [CID: ${correlationId}]` : '';
      return `[${timestamp}] ${level.toUpperCase()}${cid}: ${message}`;
    })
  ),
  transports: [transport],
});