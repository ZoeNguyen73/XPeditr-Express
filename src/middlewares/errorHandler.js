// default error messages to ensure user-friendliness
const defaultErrorMessages = {
  400: "Bad Request / Invalid Inputs",
  401: "Unathorized / No valid authentication credentials",
  403: "Forbidden / Users do not have the required access",
  404: "Not Found",
  500: "Internal Server Error",
};

const errorHandler = (error, req, res, next) => {
  console.log("original error: " + JSON.stringify(error));

  // set default error response
  const statusCode = error.statusCode || 500;
  // update error.message to follow the default message
  const errMessage = defaultErrorMessages[statusCode];
  // if there exists an error.message, to move the message to the details property
  const errDetails = error.details || error.message;

  const updatedError = {
    ... error, 
    message: errMessage, 
    details: errDetails,
  };

  // send error response
  res.status(statusCode).json(updatedError);
};

module.exports = errorHandler;