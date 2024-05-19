const express = require('express');

const router = express.Router({ mergeParams: true });

const equipmentController = require('../../controllers/equipmentControllers/equipmentController');
const incidentRouter = require('../incidents/incidentRoutes');
const maintenanceRouter = require('../maintenances/maintenanceRoutes');
const maintenanceSheetRouter = require('../maintenances/maintenanceSheetRoutes');
const authController = require('../../controllers/usersControllers/authController');

router.use(authController.protect);
router.use(authController.isLoggedIn);

router.use('/:equipmentId/incident', incidentRouter);
router.use('/:equipmentId/maintenance', maintenanceRouter);
router.use('/:equipmentId/maintenanceSheet', maintenanceSheetRouter);

router.route('/').get(equipmentController.getAllEquipments);

router
  .route('/:id/archiveEquipment')
  .patch(equipmentController.archiveEquipment);

router.route('/newEquipment').post(equipmentController.createEquipment);

router
  .route('/:id')
  .get(equipmentController.getEquipment)
  .patch(equipmentController.updateEquipment)
  .delete(equipmentController.deleteEquipment);

module.exports = router;
