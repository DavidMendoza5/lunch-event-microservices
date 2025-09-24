import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/error.util';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Unexpected error.',
  });
};

export default errorHandler;
