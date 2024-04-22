const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./appError');
const User = require('../models/userModels/userModel');
const catchAsync = require('./catchAsync');

// async function xxxxxxxx = () {
// };

// ###################  find user by token  ####################
async function findUserByToken(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Vous devez être loggé pour avoir accès à cette page', 401),
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  return currentUser;
}

module.exports = {
  findUserByToken,
};
