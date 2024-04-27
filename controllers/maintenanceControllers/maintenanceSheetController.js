const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const handler = require('../cruadHandler');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const Maintenance = require('../../models/maintenanceModels/maintenanceModel');
const MaintenanceSheet = require('../../models/maintenanceModels/maintenanceSheetModel');
const MaintenanceSheetUpdatedByAt = require('../../models/maintenanceModels/maintenanceSheetUpdatedByAt');
const User = require('../../models/userModels/userModel');
const { findUserByToken } = require('../../utils/functionsLibrary');
const MaintenanceSteps = require('../../models/maintenanceModels/maintenanceStepsModel');
const MaintenanceStepComment = require("../../models/maintenanceModels/maintenanceStepComment");

exports.setMaintenanceId = (req, res, next) => {
  if (!req.body.maintenance) req.body.maintenance = req.params.maintenanceId;
  next();
};

exports.createNewSheet = catchAsync(async (req, res, next) => {
  const maintenance = await Maintenance.findById(
    req.params.maintenanceId,
  ).populate('maintenanceSheet');

  if (!maintenance) {
    return next(new AppError('Pas de maintenance trouvée'), 404);
  }

  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'};
  var numberMS = new Date().toLocaleString('fr-FR', options).replaceAll('/', '').replaceAll(':', '').replaceAll(' ', '');
  req.body.name = `FM_${maintenance.code}_${numberMS}`;
  req.body.maintenanceSteps = maintenance.steps;
  req.body.startedBy = res.locals.user.id;
  // req.body.maintenanceSteps.title = maintenance.steps.title;
  req.body.equipment = maintenance.equipment.id;
  const maintenanceSheet = (await MaintenanceSheet.create(req.body));
  maintenance.steps.forEach(async (el) => {
        await MaintenanceSteps.create({
          maintenance: maintenance.id,
          maintenanceSheet: maintenanceSheet.id,
          number : el.number,
          title : el.title,
          description : el.description,
      }); 
  });
  res.status(201).json({
    status: 'success',
    data: {
      data: maintenanceSheet,
    },
  });
});

exports.getSteps = catchAsync(async (req, res, next) => {
  const steps = await MaintenanceSteps.find({ maintenanceSheet : req.params.maintenanceId});
  if (!steps) {
    return next(new AppError('Pas de maintenance trouvée'), 404);
  } 
  res.status(201).json({
    status: 'success',
    data: {
      data: steps,
    },
  });
});

exports.commentStep = catchAsync(async (req, res, next) => {
  req.body.commentedBy = res.locals.user.id;
  const comment = await MaintenanceStepComment.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: comment,
    },
  });
})

exports.getComments = catchAsync(async (req, res, next) => {
  const comments = await MaintenanceStepComment.find({ maintenanceSheet : req.params.id}).populate('commentedBy step');
  res.status(201).json({
    status: 'success',
    data: {
      data: comments,
    },
  });
})

exports.getOneStep = catchAsync( async (req, res, next) => {
  const step = await MaintenanceSteps.findById(req.params.stepId);
  if (!step || step === null) {
    return next(new AppError('Pas de step'), 404);
  }
  res.status(201).json({
    status: 'success',
    data: {
      data: step,
    },
  });
})

exports.actionStep = catchAsync(async (req, res, next) => {
  req.body.updatedAt = Date.now()
  const step = await MaintenanceSteps.findByIdAndUpdate(req.params.stepId, req.body);
  if (!step) {
    return next(new AppError('Page non trouvé', 404));
  }
  res.status(201).json({
    status: 'success', 
    data: {
      data: step,
    }
  });
});

exports.validateMaintenanceSheet = catchAsync(async (req, res, next) => {
  const FM = await MaintenanceSheet.findById(req.params.id);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('Vous devez être loggé pour avoir accès à cette page', 401),
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!FM) {
    return next(new AppError('Page non trouvé', 404));
  }
  if (FM.finalStatus !== 'Fait') {
    return next(new AppError('La FM doit être faite', 501));
  }
  if (FM.isValidate === true) {
    return next(new AppError('FM déjà validée', 501));
  }
  const FM2 = await MaintenanceSheet.findByIdAndUpdate(
    req.params.id,
    { isValidate: true, isValidatedBy: currentUser },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    status: 'success',
    data: {
      data: FM2,
    },
  });
});

exports.getAllMaintenanceSheet = handler.getAll(MaintenanceSheet, 'equipment startedBy');
exports.getMaintenanceSheet = handler.getOne(MaintenanceSheet);
exports.updateMaintenanceSheet = handler.updateOne(MaintenanceSheet);
