const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const serviceSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
    isUsed: {
      type: Boolean,
      default: true,
    },
    laboratory: {
      type: mongoose.Schema.ObjectId,
      ref: 'Laboratory',
      // required: [true, 'Veuillez renseigner un laboratoire'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
