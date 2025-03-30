// src/errors/validation.error.ts

import { BaseException } from './base.error';

export class ValidationException extends BaseException {
  constructor(message: string) {
    super(400, message);
  }
}