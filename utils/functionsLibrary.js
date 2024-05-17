const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./appError');
const User = require('../models/userModels/userModel');
const catchAsync = require('./catchAsync');

// ###################  find user by token  ####################
function getToken(reqHeaders) {
  let token;
  if (
    reqHeaders.authorization &&
    reqHeaders.authorization.startsWith('Bearer')
  ) {
    // remove 'Bearer' from the token string getting only token string.
    token = reqHeaders.authorization.split(' ')[1];
  } else if  (
    reqHeaders.Authorization &&
    reqHeaders.Authorization.startsWith('Bearer')
  ) {
    // remove 'Bearer' from the token string getting only token string.
    token = reqHeaders.Authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Vous devez être loggé pour avoir accès à cette page', 401),
    );
  }
  return token;
}

async function findUserByToken(reqHeaders) {
  const token = getToken(reqHeaders)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  return currentUser;
}

module.exports = {
  getToken,
  findUserByToken,
};
