// errors/AppError.ts
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// errors/ValidationError.ts
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400); // 400 Bad Request
  }
}

// errors/NotFoundError.ts
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404); // 404 Not Found
  }
}

// errors/InternalServerError.ts
export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500); // 500 Internal Server Error
  }
}
