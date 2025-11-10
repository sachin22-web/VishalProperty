import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof ZodError) {
    message = err.errors?.[0]?.message || 'Validation error';
    return res.status(400).json({ message });
  }

  if (err?.name === 'ValidationError') {
    message = err.message || 'Validation error';
    return res.status(400).json({ message });
  }

  if (err?.code === 11000) {
    // Mongo duplicate key
    return res.status(409).json({ message: 'Duplicate value' });
  }

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error('Server error:', err);
  }

  res.status(status).json({ message });
}
