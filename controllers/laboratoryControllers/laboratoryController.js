const Laboratory = require('../../models/laboratoryModels/laboratoryModel');
const handler = require('../cruadHandler');

//1. MIDDLEWARE

//2. Handler
exports.createLaboratory = handler.createOne(Laboratory);
exports.getAllLaboratorys = handler.getAll(Laboratory);
exports.getLaboratory = handler.getOne(Laboratory);
exports.deleteLaboratory = handler.deleteOne(Laboratory);
exports.updateLaboratory = handler.updateOne(Laboratory);
exports.archiveLaboratory = handler.archiveOne(Laboratory);
