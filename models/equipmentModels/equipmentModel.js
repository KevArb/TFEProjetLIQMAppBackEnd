const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const Incident = require('../incidentModels/incidentModel');

// const EquipmentSupplier = require('./equipmentSupplierModel');
// const EquipmentCategory = require('./equipmentCategoryModel');
// const Service = require('../laboratoryModels/serviceModel');

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Un equipements doit avoir un nom'],
      trim: true,
      maxLength: [32, "Maximum 32 caractères pour un nom d'équipement"],
    },
    code: {
      type: String,
      required: [true, 'Veuillez renseigner un code equipement'],
      trim: true,
      maxLength: [8, 'Max 8 caractères'],
      minLength: [4, 'Min 4 caractères'],
    },
    serialNumber: {
      type: String,
      required: [true, 'Un equipements doit avoir un numéro de série'],
      trim: true,
    },
    description: String,
    isUsed: {
      type: Boolean,
      default: true,
    },
    image: String,
    documentation: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    productionDate: Date,
    supplierMaintenanceDate: Date,
    supplier: {
      type: mongoose.Schema.ObjectId,
      ref: 'EquipmentSupplier',
      required: [true, 'Veuillez renseigner un fournisseur'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'EquipmentCategory',
      required: [true, 'Veuillez renseigner une catégorie'],
    },
    service: {
      type: mongoose.Schema.ObjectId,
      ref: 'Service',
      required: [true, 'Veuillez renseigner un service'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

equipmentSchema.virtual('incidents', {
  ref: 'Incident',
  foreignField: 'equipment',
  localField: '_id',
});

equipmentSchema.virtual('maintenances', {
  ref: 'Maintenance',
  foreignField: 'equipment',
  localField: '_id',
});

equipmentSchema.virtual('nbIncidents', {
  ref: 'Incident',
  foreignField: 'equipment',
  localField: '_id',
  count: true,
});

// equipmentSchema.post('save', function (next) {

//   next();
// });


const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;
