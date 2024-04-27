const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const Maintenance = require('./maintenanceModel');

const maintenanceStepsSchema = new mongoose.Schema(
  {
    maintenance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Maintenance',
    }, 
    maintenanceSheet: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceSheet',
    }, 
    number: Number,
    title: String,
    description: String,
    status: {
      type: String,
      enum: ['En cours', 'Erreur', 'En attente', 'Fait'],
      default: 'En cours',
    },
    comment: {
      type: String,
      default: '',
    }, 
    updatedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const MaintenanceSteps = mongoose.model(
  'MaintenanceSteps',
  maintenanceStepsSchema,
);

module.exports = MaintenanceSteps;
