const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const Equipment = require('../equipmentModels/equipmentModel');

const incidentSchema = new mongoose.Schema(
  {
    code: String,
    title: {
      type: String,
      required: [true, 'Veuillez renseigner un titre'],
      maxlength: [32, 'Maximum 32 caractères'],
      minlength: [4, 'Minimu 4 caractères'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Veuillez renseigner une description'],
      trim: true,
    },
    dateTimeOfIncident: {
      type: Date,
      default: Date.now(),
    },
    impact: {
      type: String,
      enum: {
        values: ['Bas', 'Moyen', 'Haut', 'Urgent'],
      },
      default: 'Low',
    },
    status: {
      type: String,
      enum: {
        values: ['En cours', 'En attente', 'Résolu', 'Clôturé'],
      },
      default: 'En cours',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedAt: Date,
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//MIDELWARE PRE
incidentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'equipment',
    select: '-__v -createdAt -id -incidents -isUsed',
  });
  next();
});


const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;