export const errorHandler = (err, req, res, next) => {
  console.error(" Error:", err);
  let statusCode = 500;
  let message = "Internal Server Error";
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }
  else if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field '${duplicatedField}'`;
  }
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again.";
  }
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please login again.";
  }
  else if (err.statusCode === 401 || err.message === "Unauthorized") {
    statusCode = 401;
    message = err.message || "Unauthorized";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
