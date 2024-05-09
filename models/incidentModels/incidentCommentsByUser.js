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
      enum: ['Commentaire', 'En cours', "En attente d'une action", 'Résolu', 'Clôturé', 'Clarification'],
      default: 'Commentaire'
    },
    comment: String,
    createdAt: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

incidentCommentsByUserSchema.pre('save', function(next) {
  this.createdAt = new Date();
  next();
})

const IncidentCommentsByUser = mongoose.model(
  'IncidentCommentsByUser',
  incidentCommentsByUserSchema,
);

module.exports = IncidentCommentsByUser;
