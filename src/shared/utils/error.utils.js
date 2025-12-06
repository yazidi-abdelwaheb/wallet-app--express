

export class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
export const errorCatch = (error, req, res) => {
  const endpoint = `${req.method} ${req.originalUrl}` || "Unknown endpoint";
  const statusCode = error.statusCode || 500;
  const message = error.message || "Server Error";
  console.error(`[${endpoint}] : ${message} - ${statusCode}`);
  return res.status(statusCode).json({ message: message });
};