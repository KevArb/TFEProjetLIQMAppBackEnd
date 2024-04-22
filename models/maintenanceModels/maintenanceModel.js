const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    name: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    code: String,
    steps: [
      {
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
      },
    ],
    isTimeOut: {
      type: Boolean,
      default: false,
    },
    timeOutCount: Number,
    warningTimeOut: {
      type: Boolean,
      default: false,
    },
    updatedAt: Date,
    isUsed: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interval',
    },
    equipment: {
      required: [true, 'Veuillez sélectionner un équipement'],
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
maintenanceSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'equipment',
    select: '-__v -createdAt',
  });
  next();
});

maintenanceSchema.virtual('maintenanceSheet', {
  ref: 'MaintenanceSheet',
  foreignField: 'maintenance',
  localField: '_id',
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
