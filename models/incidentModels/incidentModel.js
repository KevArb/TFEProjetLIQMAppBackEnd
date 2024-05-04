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
      enum: ['En cours', "En attente d'une action", 'Résolu', 'Clôturé', 'Clarification'],
      default: 'En cours',
    },
    createdAt: {
      type: Date,
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
    isClosed: {
      type: String,
      default: false,
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//MIDELWARE PRE
incidentSchema.pre('save', function(next) {
  this.dateTimeOfIncident = new Date();
  this.createdAt = new Date();
  next();
})
incidentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'equipment',
    select: '-__v -createdAt -id -incidents -isUsed',
  });
  next();
});


const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;
