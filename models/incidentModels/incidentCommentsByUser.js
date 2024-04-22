const mongoose = require('mongoose');

const incidentCommentsByUserSchema = new mongoose.Schema(
  {
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    commentType: {
      type: String,
      enum: ['Résolution', 'Clôture', 'Commentaire', 'Reouvert'],
      default: 'Commentaire'
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const IncidentCommentsByUser = mongoose.model(
  'IncidentCommentsByUser',
  incidentCommentsByUserSchema,
);

module.exports = IncidentCommentsByUser;
