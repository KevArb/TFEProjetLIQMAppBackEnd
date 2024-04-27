const express = require('express');

const router = express.Router({ mergeParams: true });
const maintenanceController = require('../../controllers/maintenanceControllers/maintenanceController');
const maintenanceSheetRouter = require('./maintenanceSheetRoutes');
const authController = require('../../controllers/usersControllers/authController');

router.use(authController.protect);
router.use(authController.isLoggedIn);

router
  .route('/getMaintenance/:id')
  .get(maintenanceController.getMaintenanceUpdate)
  .patch(maintenanceController.updateMaintenanceSheet);

router.use('/:maintenanceId', maintenanceSheetRouter);

router.route('/').get(maintenanceController.getAllMaintenance);

router
  .route('/newMaintenance')
  .post(
    maintenanceController.setEquipmentId,
    maintenanceController.createMaintenance,
);

router
  .route('/newMaintenance2')
  .post(
    maintenanceController.newMaintenance,
);

module.exports = router;
