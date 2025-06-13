const notFoundHandler = (req, res, next) => {
  console.log("url: ", req.originalUrl);
  const error = new Error("Resource not found");
  error.statusCode = 404;
  next(error);
};

module.exports = notFoundHandler;