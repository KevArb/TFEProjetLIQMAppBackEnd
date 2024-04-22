const Service = require('../../models/laboratoryModels/serviceModel');
const handler = require('../cruadHandler');

//1. MIDDLEWARE

//2. Handler
exports.createService = handler.createOne(Service);
exports.getAllServices = handler.getAll(Service);
exports.getService = handler.getOne(Service);
exports.deleteService = handler.deleteOne(Service);
exports.updateService = handler.updateOne(Service);
exports.archiveService = handler.archiveOne(Service);
