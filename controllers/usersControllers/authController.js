const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModels/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { findUserByToken } = require('../../utils/functionsLibrary');

// ############################   🤝 Token Management    ###################################
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
});

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
 
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  // remove the password from the output (JSON) in order to be not visible
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// ##################    🔐 Login management   ##########################

// New user will be created by 'manager' or 'admin', don't need this function (not yet but maybe)
exports.createNewUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

// This function is used for login into the system
// gonna check if login and password exist and are correct
exports.login = catchAsync(async (req, res, next) => {
  const { login, password } = req.body;
  // 1) check if email and password exist
  if (!login || !password) {
    return next(
      new AppError('Veuillez renseigner un login et un mot de passe', 400),
    );
  }

  // 2) check if user exist and if the pawword is correct
  const user = await User.findOne({ login }).select('+password');
  // console.log(user)
  // If user doesn't exist or the password is incorrect => return error and quit global function
  // If are correct, status 200
  // We call function "correctPassword" from auth Model and we put some args.
  // We compare password write by user (password variable) and real password from this user, that we got into DB.
  // We check if this user exist as well, so find it by login.
  if (user === null || !user ) {
    return next(new AppError('Email ou mot de passe incorrecte', 401));
  } else if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email ou mot de passe incorrecte', 401));
  }

  res.locals.user = user;

  // 3) if everything is OK, send token to client
  createSendToken(user, 200, res);
});

// exports.logout = catchAsync(async (req, res, next) => {
//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
//     ),
//     httpOnly: true,
//   };

//   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

//   const token = '';
//   res.cookie('jwt', token, cookieOptions);
//   const message = 'OK';
//   res.status(200).json({
//     status: 'success',
//     token,
//     message,
//   });
// });

// #########################   ✋⛔️ Protecting routes management   #############################

// LogOut function 
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Déconnexion réussie.' });
}

// Middleware whcich check if user is well logged In
exports.isLoggedIn = async (req, res, next) => {

  try {
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
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      res.locals.user = currentUser;
      return next()
  } catch (error) {
      return next();
  }
};

// 🧑‍💻 Middleware who Protect routes by being logged in the system
exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and check if it exist, if not or exparied need to be logged
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

  // console.log(token)
  // if token doesn't exist, means that no user is logged
  if (!token || token === 'null') {
    return next(
      new AppError('Vous devez être loggé pour avoir accès à cette page', 401),
    );
  }
  //2) 🤝 Verification of the token (if signature is valide)
  // function that need call a promise => PROMISIFY
  // " It convert a callback-based function into a function that returns a Promise
  // This allows you to use the more modern and convenient async/await syntax or promise chaning when working with asynchronous operations. "
  // Not understand everything about PROMISIFY but it's working fine
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("Le token appartenant à cette user n'est plus valide"),
      401,
    );
  }

  //4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Mot de passe changé récemment, veuillez-vous connecter'),
      401,
    );
  }
  
  // 🔓 Grant access to protected routes
  req.user = currentUser;
  next();
});

// This function protect some routes => PERMISSION
// to put params in middleware we have to encaplsulate this middleware into a function
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles is an array
    if (!roles.includes(req.user.role)) {
      return next(
        //403 => forbidden
        new AppError("Vous n'avez pas la persmission de faire cela", 403),
      );
    }
    next();
  };
