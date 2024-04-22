const Supplier = require('../../models/equipmentModels/equipmentSupplierModel');
const handler = require('../cruadHandler');

exports.createSupplier = handler.createOne(Supplier);
exports.getAllSuppliers = handler.getAll(Supplier);
exports.getSupplier = handler.getOne(Supplier);
exports.deleteSupplier = handler.deleteOne(Supplier);
exports.updateSupplier = handler.updateOne(Supplier);
exports.archiveSupplier = handler.archiveOne(Supplier);
