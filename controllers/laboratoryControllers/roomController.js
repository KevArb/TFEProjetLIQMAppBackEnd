const Room = require('../../models/laboratoryModels/roomModel');
const handler = require('../cruadHandler');

//1. MIDDLEWARE

//2. Handler
exports.createRoom = handler.createOne(Room);
exports.getAllRooms = handler.getAll(Room);
exports.getRoom = handler.getOne(Room);
exports.deleteRoom = handler.deleteOne(Room);
exports.updateRoom = handler.updateOne(Room);
exports.archiveRoom = handler.archiveOne(Room);
