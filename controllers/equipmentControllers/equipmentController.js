const Equipment = require('../../models/equipmentModels/equipmentModel');
const catchAsync = require('../../utils/catchAsync');
const handler = require('../cruadHandler');
const AppError = require('../../utils/appError');

exports.createEquipment = handler.createOne(Equipment);

exports.getAllEquipments = handler.getAll(Equipment, 'supplier category service');

exports.getEquipment = handler.getOne(Equipment, {
  path: 'incidents nbIncidents maintenances supplier category service',
});
exports.deleteEquipment = handler.deleteOne(Equipment);
exports.updateEquipment = handler.updateOne(Equipment);
exports.archiveEquipment = handler.archiveOne(Equipment);
