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

exports.uploadImgProfil = catchAsync( async (req, res, next) => {
  const imageName = req.file.filename
  const user = await User.findByIdAndUpdate(req.body.id, { pictureProfile: imageName })
  res.status(200).json({
    status: 'success',
    data: {
      user : user,
    },
  });
})

exports.getImageProfil = catchAsync( async (req, res, next) => {
  console.log('1')
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if  (
    req.body.headers.Authorization &&
    req.body.headers.Authorization.startsWith('Bearer')
  ) {
    token = req.body.headers.Authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('Vous devez être loggé pour avoir accès à cette page', 401),
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  const image = currentUser.pictureProfile
  console.log(image)
  // res.set('Content-Type', image.contentType)
  res.send({ status: 'ok', data: image})
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     user : currentUser,
  //   },
  // });

})

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

  if (!currentUser) {
      return next(new AppError("Le token n'est plus valide"), 401);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user : currentUser,
    },
  });
});

exports.getUser = async(req, res, next) => {
  let error = '';
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if  (
    req.body.headers.Authorization &&
    req.body.headers.Authorization.startsWith('Bearer')
  ) {
    token = req.body.headers.Authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('Vous devez être loggé pour avoir accès à cette page', 401),
    );
  }

  const oldPassword = req.body.oldPassword;
  const pwd1 = req.body.password;
  const pwd2 = req.body.passwordConfirm;
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id).select('+password');

  if (!oldPassword) {
    error = 'Veuillez renseigner votre ancien mot de passe'
  } else if (!(await currentUser.correctPassword(oldPassword, currentUser.password))) {
    error = 'Mot de passe incorrect'
  }
  if (pwd1 === undefined || pwd2 === undefined) {
    error = error + '/' + 'Veuillez compléter un nouveau mot de passe'
  } else if ( pwd1 != pwd2 ) {
    error = error + '/' + 'les nouveaux mot de passes ne sont pas identiques'
  }
  if (error != '') {
    return next(
      new AppError(error, 400),
    );
  }
  res.status(200).json({
    status: 'success',
    message:' ok'
  });
}

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

  if (!token) {
    return next(
      new AppError('Vous devez être loggé pour avoir accès à cette page', 401),
    );
  }

  const pwd1 = req.body.password;
  const pwd2 = req.bpdy.passwordConfirm;
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findByIdAndUpdate(decoded.id, {password: pwd1, passwordConfirm: pwd2}, filteredBody, {
    new: true,
    runValidator: true,
  })


  res.status(200).json({
    status: 'success',
  });

}

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
    console.log('1')
    // remove 'Bearer' from the token string getting only token string.
    token = req.headers.authorization.split(' ')[1];
  } else if  (
    req.body.headers.Authorization &&
    req.body.headers.Authorization.startsWith('Bearer')
  ) {
    console.log('2')
    // remove 'Bearer' from the token string getting only token string.
    token = req.body.headers.Authorization.split(' ')[1];
  }

  // if token doesn't exist, means that no user is logged
  if (!token) {
    return next(
      new AppError('Vous devez être loggé pour avoir accès à cette page', 401),
    );
  }
  console.log('3')
  //3) Check if user still exists
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  console.log(currentUser)

  // console.log(currentUser.password);
  // console.log(req.body.password)

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
