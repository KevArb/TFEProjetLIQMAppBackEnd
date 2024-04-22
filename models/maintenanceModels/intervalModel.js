const mongoose = require('mongoose');

const intervalSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Interval = mongoose.model('Maintenance', intervalSchema);

module.exports = Interval;
