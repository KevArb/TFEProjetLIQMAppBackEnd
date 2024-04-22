const EquipmentCat = require('../../models/equipmentModels/equipmentCategoryModel');
const handler = require('../cruadHandler');
//test

exports.createEquipmentCat = handler.createOne(EquipmentCat);
exports.getAllEquipmentCats = handler.getAll(EquipmentCat);
exports.getEquipmentCat = handler.getOne(EquipmentCat);
exports.deleteEquipmentCat = handler.deleteOne(EquipmentCat);
exports.updateEquipmentCat = handler.updateOne(EquipmentCat);
exports.archiveEquipmentCat = handler.archiveOne(EquipmentCat);
