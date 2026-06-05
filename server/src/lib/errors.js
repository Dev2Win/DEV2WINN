/**
 * Standard API error envelope: { error: { code, message, details, traceId } }.
 * Throw AppError from anywhere; the Express error middleware maps it to a response.
 */
export class AppError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} code
   * @param {string} message
   * @param {unknown} [details]
   */
  constructor(statusCode, code, message, details) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const Errors = {
  unauthorized: (m = 'Unauthorized') => new AppError(401, 'UNAUTHORIZED', m),
  forbidden: (m = 'Forbidden') => new AppError(403, 'FORBIDDEN', m),
  notFound: (m = 'Not found') => new AppError(404, 'NOT_FOUND', m),
  conflict: (m = 'Conflict') => new AppError(409, 'CONFLICT', m),
  validation: (m = 'Invalid input', d) => new AppError(422, 'VALIDATION', m, d),
  internal: (m = 'Internal error') => new AppError(500, 'INTERNAL', m),
};

/**
 * Express error-handling middleware. Stored procedures signal domain errors as
 * `SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='CODE:message'`; we parse that prefix
 * into a code where present.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const traceId = req.id;

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details, traceId },
    });
  }

  // mysql2 SIGNAL errors arrive as { sqlState: '45000', message: 'CODE:msg' }
  if (err && err.sqlState === '45000' && err.message) {
    const [code, ...rest] = err.message.split(':');
    return res.status(409).json({
      error: { code: code || 'DOMAIN_ERROR', message: rest.join(':').trim() || code, traceId },
    });
  }

  req.log?.error({ err }, 'unhandled error');
  return res.status(500).json({
    error: { code: 'INTERNAL', message: 'Internal server error', traceId },
  });
}
