// src/error/base.error.ts

export class BaseException {
    public statusCode: number;
    public message: string;
  
    constructor(statusCode = 400, message = 'Bad Request') {
      this.statusCode = statusCode;
      this.message = message;
    }
  }