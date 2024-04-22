const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
 
const handleDuplicateFiledsDB = (err) => {
  const message = `Duplicate field value: "${err.keyValue.name}", please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data : ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = (err) =>
  new AppError('Your token has expired. Please log in again', 401);

const sendErrorDev = (err, req, res) => {
    // on API url error
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    } else {
        // on render web site
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong !',
            msg: err.message
        })
    }

};

const sendErrorProd = (err, req, res) => {
  // operational error trsuted error: send message to client
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });    
        // Programming error or other unknown error : don't leak error details
      } else {
        // 1) Log error
        //console.error('Error');
        // 2) send generic message
        return res.status(500).json({
          status: 'error',
          message: 'Something went very wrong',
        });
      }
  } else {
    // Render web site
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
          title: 'Something went wrong !',
          msg: 'Please try again later',
        });   
      } else {
        return res.status(err.statusCode).render('error', {
          title: 'error !',
          msg: 'Please try again later',
        });
      }   
  }

};

module.exports = (err, req, res, next) => {
  // err.stack will point where the err is
  //console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // ... means destructuring our variable
    let error = { ...err };
    error.message = err.message;
    
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFiledsDB(error);
    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
 
    sendErrorProd(error, req, res);
  }
};
