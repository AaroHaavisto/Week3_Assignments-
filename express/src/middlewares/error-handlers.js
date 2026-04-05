const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Keep Express error middleware signature (err, req, res, next).
  void next;
  const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 400 : 500);
  const message =
    err.code === 'LIMIT_FILE_SIZE' ? 'File too large. Max size is 10 MB.' : err.message;

  res.status(status).json({
    error: {
      message,
      status,
    },
  });
};

export {notFoundHandler, errorHandler};