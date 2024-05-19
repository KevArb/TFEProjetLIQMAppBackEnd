const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Le prénom doit être renseigné'],
      trim: true,
      minlength: 4,
    },
    lastName: {
      type: String,
      required: [true, 'Le nom doit être renseigné'],
      trim: true,
    },
    login: {
      type: String,
      required: [true, 'Le login doit être renseigné'],
      unique: true,
      minlength: 4,
      maxlength: 10,
      trim: true,
    },
    email: {
      type: String,
      reuiqred: [true, 'Un mail doit être renseigné'],
      lowercase: true,
      validate: [validator.isEmail, 'Veuillez renseigner un email valide'],
      unique: true,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'manager', 'admin'],
        message: 'Un rôle doit être renseigné'
      },
    },
    photo: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // updatedAt: Date,
    isUsed: {
      type: Boolean,
      default: true,
    },
    pictureProfile: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Veuillez rentrer un mot de passe'],
      minlength: 4,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Veuillez confirmer votre mot de passe'],
      validate: {
        // validator return false or true, only works on save() and create() !!!
        validator: function (el) {
          return el === this.password;
        },
      message: 'Les mots de passes ne sont pas identiques',
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
});

userSchema.post('save', function(error, doc, next) {
  if (error.keyValue != '' && error.code === 11000) {
    next(new Error('Ce login existe déjà !!!'));
  } else {
    next(error);
  }
});

// Middleware which gonna hash the new password.
userSchema.pre('save', async function (next) {
  // Only run this function if password has not been modified
  if (!this.isModified('password')) return next();

  // Hash the pwd with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete pwd field
  this.passwordConfirm = undefined;
  next();
});

// if pwd has been modified and not new, we add date now on field passwordChangedAt
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/////////////////////////////////////////////////////////////////////////////////

//instance method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp; // if JWTtimstamp is < to changedTimestamp => true
  }

  // False mean not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // this token gonna send to the user => the user can use it to create a new password
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  // Bug to fix: for this project I needed to add 2 hours because Date.now() return date -one hour ???
  this.passwordResetExpires = Date.now() + 2 * 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
