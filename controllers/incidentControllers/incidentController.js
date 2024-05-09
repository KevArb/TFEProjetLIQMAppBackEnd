const handler = require('../cruadHandler');
const Incident = require('../../models/incidentModels/incidentModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const Equipment = require('../../models/equipmentModels/equipmentModel');
const { findUserByToken } = require('../../utils/functionsLibrary');
const IncidentCommentsByUser = require('../../models/incidentModels/incidentCommentsByUser');

exports.setEquipmentId = (req, res, next) => {
  // Allow nested routes, if no tour or user specified
  if (!req.body.equipment) req.body.equipment = req.params.equipmentId;
  next();
};
exports.setIncidentId = (req, res, next) => {
  // Allow nested routes, if no tour or user specified
  if (!req.body.incident) req.body.incident = req.params.id;
  next();
};

exports.closeIncident = catchAsync(async (req, res, next) => {
  const incident = await Incident.findByIdAndUpdate(req.params.id, {
    status: 'Clôturer',
  });
  if (!incident) {
    return next(new AppError('Page non trouvé', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: incident,
    },
  });
});

exports.createIncident = catchAsync(async (req, res, next) => {
  const equipment = await Equipment.findById(req.params.equipmentId).populate(
    'incidents nbIncidents',
  );
  if (!equipment) {
    return next(new AppError("Pas d'equipment trouvé"), 404);
  }
  req.body.createdBy = await findUserByToken(req, res, next);
  const code = `${equipment.code}_I_N${equipment.nbIncidents}_${Date.now()}`;
  req.body.code = code;
  const incident = await Incident.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: incident,
    },
  });
});

exports.commentIncident = catchAsync(async (req, res, next) => { 
  console.log(req.params.id) 
  const incident = await Incident.findById(req.params.id);
  req.body.commentedBy = res.locals.user.id;
  req.body.incident = incident;
  console.log(req.body)
  const incidentComment = await IncidentCommentsByUser.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      data: incidentComment,
    },
  });
});

exports.getComments = catchAsync(async (req, res, next) => {
  const comments = await IncidentCommentsByUser.find({incident : req.params.id }).populate('commentedBy');
  res.status(200).json({
    status: 'success',
    data: {
      data: comments,
    },
  });
})

exports.getIncidentsByIdEquipment = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.equipmentId) filter = { equipment: req.params.equipmentId };
  const incidents = await Incident.find( filter ).populate('createdBy');
  res.status(200).json({
    status: 'success',
    data: {
      data: incidents,
    },
  });
});

exports.getIncidentDetails = catchAsync(async (req, res, next) => {
  const incident = await Incident.findById(req.params.id).populate('createdBy');
  const role = res.locals.user.role
  const user = res.locals.user.login
  res.status(200).json({
    status: 'success',
    role: role,
    login: user,
    data: {
      data: incident,
    },
  });
})

exports.updateIncident = handler.updateOne(Incident);
exports.deleteIncident = handler.deleteOne(Incident);
exports.getAllIncidents = handler.getAll(Incident, 'createdBy');
exports.getIncident = handler.getOne(Incident);
