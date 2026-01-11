export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  
  // Ensure CORS headers are set on error responses
  const origin = req.headers.origin;
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  
  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

