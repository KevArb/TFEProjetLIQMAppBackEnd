const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const Maintenance = require('./maintenanceModel');

const maintenanceSheetSchema = new mongoose.Schema(
  {
    name: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
    maintenanceSteps: [
      {
        number: Number,
        title: String,
        description: String,
        status: {
          type: String,
          enum: ['En cours', 'Erreur', 'En attente', 'Fait'],
        },
        comment: {
          type: String,
        },
      },
    ],
    maintenance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Maintenance',
    },
    finalComment: String,
    finalStatus: {
      type: String,
      enum: ['En cours', 'En erreur', 'En attente', 'Fait', 'Discontinué'],
      default: 'En cours',
    },
    isValidate: {
      type: Boolean,
      default: false,
    },
    isValidatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
    },
    modifiedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    startedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
  }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// maintenanceSheetSchema.post(/^find/, function (doc) {
//   console.log(this.maintenanceSteps);
// });

maintenanceSheetSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'maintenance',
    select: '-__v -id',
  });
  next();
});

const MaintenanceSheet = mongoose.model(
  'MaintenanceSheet',
  maintenanceSheetSchema,
);

module.exports = MaintenanceSheet;
