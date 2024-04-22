const handler = require('../cruadHandler');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const Equipment = require('../../models/equipmentModels/equipmentModel');
const Maintenance = require('../../models/maintenanceModels/maintenanceModel');

exports.setEquipmentId = (req, res, next) => {
  // Allow nested routes, if no tour or user specified
  if (!req.body.equipment) req.body.equipment = req.params.equipmentId;
  next();
};

exports.createMaintenance = catchAsync(async (req, res, next) => {
  const equipment = await Equipment.findById(req.params.equipmentId).populate(
    'maintenances',
  );
  if (!equipment) {
    return next(new AppError("Pas d'equipment trouvé arghf"), 404);
  }

  // const countMaintenance = nbMaintenance() + 1;
  // console.log(countMaintenance);
  const code = `M_${equipment.code}`;
  req.body.code = code;
  // req.body.equipment = '65ad3211fa32571a0ad35568';

  const maintenance = await Maintenance.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: maintenance,
    },
  });
});

exports.newMaintenance = catchAsync(async (req, res, next) => {
  const equipment = await Equipment.findById(req.body.equipment).populate(
    'maintenances',
  );

  if (!equipment) {
    return next(new AppError("Pas d'equipment trouvé arghf"), 404);
  }
  const code = `M_${equipment.code}`;
  req.body.code = code;
  const maintenance = await Maintenance.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: maintenance,
    },
  });
});

exports.updateMaintenanceSheet = handler.updateOne(Maintenance);
exports.getAllMaintenance = handler.getAll(Maintenance);
exports.getMaintenance = handler.getOne(Maintenance);
exports.archiveMaintenance = handler.archiveOne(Maintenance);
