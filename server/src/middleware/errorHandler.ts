import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const issues = (err as any).issues || (err as any).errors || [];
    const errorMessages = issues.length > 0
      ? issues.map((e: any) => `${e.path?.join('.') || 'field'}: ${e.message}`).join(', ')
      : err.message;

    console.warn(`[ValidationWarning] ${req.method} ${req.path}: ${errorMessages}`);
    return res.status(400).json({
      success: false,
      error: `Validation failed: ${errorMessages}`,
      details: err.flatten ? err.flatten() : undefined,
    });
  }

  // Handle Multer upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'File upload exceeds maximum allowed size (15MB).',
    });
  }

  // Handle SyntaxError in JSON body
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload in request body.',
    });
  }

  // Determine appropriate HTTP status code
  let statusCode = err.statusCode;
  if (!statusCode || statusCode === 500) {
    if (
      err.message?.includes('Invalid email or password') ||
      err.message?.includes('Authentication required') ||
      err.message?.includes('Current password is incorrect')
    ) {
      statusCode = 401;
    } else if (
      err.message?.includes('already exists') ||
      err.message?.includes('Conflict')
    ) {
      statusCode = 409;
    } else if (
      err.message?.includes('deactivated') ||
      err.message?.includes('Access denied') ||
      err.message?.includes('forbidden')
    ) {
      statusCode = 403;
    } else if (err.message?.includes('not found') || err.message?.includes('Not found')) {
      statusCode = 404;
    } else if (
      err.message?.includes('temporarily unavailable') ||
      err.message?.includes('high demand') ||
      err.message?.includes('503') ||
      err.message?.includes('overloaded') ||
      err.message?.includes('UNAVAILABLE')
    ) {
      statusCode = 503;
    } else if (
      err.message?.includes('rate limit') ||
      err.message?.includes('quota') ||
      err.message?.includes('RESOURCE_EXHAUSTED') ||
      err.message?.includes('429')
    ) {
      statusCode = 429;
    } else if (!statusCode) {
      statusCode = 500;
    }
  }

  const message = err.message || 'An unexpected error occurred.';

  if (statusCode === 503) {
    res.setHeader('Retry-After', '3');
  } else if (statusCode === 429) {
    res.setHeader('Retry-After', '5');
  }

  if (statusCode < 500 || statusCode === 503 || statusCode === 429) {
    console.warn(`[ClientWarning] ${req.method} ${req.path} (${statusCode}): ${message}`);
  } else {
    console.error(`[Error] ${req.method} ${req.path} (${statusCode}):`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 && { stack: err.stack }),
  });
}
