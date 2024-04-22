const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModels/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const handler = require('../cruadHandler');

const filterObj = (obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFileds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateUser = handler.updateOne(User);
exports.deleteUser = handler.deleteOne(User);
exports.getUser = handler.getOne(User);
exports.getAllUser = handler.getAll(User);

// ################# 📄 User Profile management #########################

exports.getPersonnalData = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  //1) Getting token and check if it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // remove 'Bearer' from the token string getting only token string.
    token = req.headers.authorization.split(' ')[1];
  } else if  (
    req.body.headers.Authorization &&
    req.body.headers.Authorization.startsWith('Bearer')
  ) {
    // remove 'Bearer' from the token string getting only token string.
    token = req.body.headers.Authorization.split(' ')[1];
  }

  // if token doesn't exist, means that no user is logged
  if (!token) {
    return next(
      new AppError('Vous devez être loggé pour avoir accès à cette page', 401),
    );
  }

  //3) Check if user still exists
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  // if (currentUser.id === req.params.userId) {
    if (!currentUser) {
      return next(new AppError("Le token n'est plus valide"), 401);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user : currentUser,
      },
    });
  // } else {
  //   return next(new AppError('Ce profile ne vous appartient pas'), 401);
  // }
});

exports.updateMe = async (req, res, next) => {
  //1) create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update, please use /updateMyPassword',
        400,
      ),
    );
  }
  //2) Filtered out unwanted fileds that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  //3) update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidator: true,
  });
  // if we use save() => issue because passwordConfirm is not specified
  // do use findById and await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
};


exports.updatePassword = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // remove 'Bearer' from the token string getting only token string.
    token = req.headers.authorization.split(' ')[1];
  } else if  (
    req.body.headers.Authorization &&
    req.body.headers.Authorization.startsWith('Bearer')
  ) {
    // remove 'Bearer' from the token string getting only token string.
    token = req.body.headers.Authorization.split(' ')[1];
  }

  // if token doesn't exist, means that no user is logged
  if (!token) {
    return next(
      new AppError('Vous devez être loggé pour avoir accès à cette page', 401),
    );
  }

  //3) Check if user still exists
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  

  console.log(currentUser.password);
  console.log(req.body.password)

  // if (req.body.password === currentUser.password) {
  //   const filteredBody = filterObj(req.body, 'login', 'email');
  //   const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
  //     new: true,
  //     runValidator: true,
  //   });
  // }

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     user: updateUser,
  //   },
  // });
};
