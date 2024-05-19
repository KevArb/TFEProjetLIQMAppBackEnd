const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const { findById } = require('../models/laboratoryModels/serviceModel');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = Model.findById(req.params.id).populate(popOptions);
    const role = res.locals.user.role;
    const user = res.locals.user.login;
    const doc  = await query;

    if (!doc) {
      return next(new AppError('Item non trouvé', 404));
    }
    
    res.status(200).json({
      status: 'success',
      role: role,
      login: user,
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model, pop) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.equipmentId) filter = { equipment: req.params.equipmentId };
    const role = res.locals.user.role;
    const user = res.locals.user.login;
    const features = new APIFeatures(Model.find(filter).populate(pop), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let doc = await features.query; 
    if (req.query.search) {
        doc = doc.filter(item => item.name.toLowerCase().includes(req.query.search.toLowerCase()))
    }
    res.status(200).json({
      status: 'success',
      results: doc.length,
      role: role,
      login: user,
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('Page non trouvé', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.archiveOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id);
    if (doc.isUsed) {
      doc.isUsed = false
    } else {
      doc.isUsed = true
    }
    const role = res.locals.user.role
    if (!doc) {
      return next(new AppError('Page non trouvé', 404));
    }
    res.status(200).json({
      status: 'success',
      role: role,
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('Page non trouvé', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
