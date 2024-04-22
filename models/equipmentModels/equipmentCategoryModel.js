const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const equipmentCategorySchema = new mongoose.Schema(
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const EquipmentCategory = mongoose.model(
  'EquipmentCategory',
  equipmentCategorySchema,
);

module.exports = EquipmentCategory;
