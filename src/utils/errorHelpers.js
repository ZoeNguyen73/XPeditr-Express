function createError(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.details = message;
  return err;
}

function badRequest(message) {
  return createError(message, 400);
}

function unauthorized(message) {
  return createError(message, 401);
}

function forbidden(message) {
  return createError(message, 403);
}

function notFound(message) {
  return createError(message, 404);
}

module.exports = { createError, badRequest, unauthorized, notFound, forbidden };