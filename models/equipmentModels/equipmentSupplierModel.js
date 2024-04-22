const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const equipmentSupplierSchema = new mongoose.Schema(
  {
    nameCompagny: {
      type: String,
      required: [true, 'Le nom du fournisseurs doit être renseigné'],
      trim: true,
      unique: true,
    },
    hotlineMail: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Veuillez renseigner un email valide'],
    },
    hotlinePhoneNumber: {
      type: String,
      default: 'Non renseigné',
    },
    hotlinePhoneNumber2: String,
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

const EquipmentSupplier = mongoose.model(
  'EquipmentSupplier',
  equipmentSupplierSchema,
);

module.exports = EquipmentSupplier;
