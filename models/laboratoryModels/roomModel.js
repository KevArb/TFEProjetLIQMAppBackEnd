const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
    isUsed: {
      type: Boolean,
      default: true,
    },
    room: {
      type: mongoose.Schema.ObjectId,
      ref: 'Room',
      required: [true, 'Veuillez renseigner une pièce du service'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
