const mongoose = require('mongoose');

const maintenanceSheetUpdatedByAtSchema = new mongoose.Schema(
  {
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const maintenanceSheetUpdatedByAt = mongoose.model(
  'MaintenanceSheetUpdatedByAt',
  maintenanceSheetUpdatedByAtSchema,
);

module.exports = maintenanceSheetUpdatedByAt;
