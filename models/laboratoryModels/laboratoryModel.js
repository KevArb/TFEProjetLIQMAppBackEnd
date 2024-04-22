const mongoose = require('mongoose');

const laboratorySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    adress: [
      {
        street: String,
        number: Number,
        zipCode: {
          type: Number,
          maxLength: [4],
          minLength: [4],
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
    isUsed: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Laboratory = mongoose.model('Laboratory', laboratorySchema);

module.exports = Laboratory;
