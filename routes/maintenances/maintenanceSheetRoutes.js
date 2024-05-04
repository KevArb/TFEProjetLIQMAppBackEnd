const express = require('express');

const router = express.Router({ mergeParams: true });
const maintenanceSheetController = require('../../controllers/maintenanceControllers/maintenanceSheetController');
const authController = require('../../controllers/usersControllers/authController');

router.use(authController.protect);
router.use(authController.isLoggedIn);
router.use(authController.protect);

router.route('/').get(maintenanceSheetController.getAllMaintenanceSheet);
router.route('/:id')
  .get(maintenanceSheetController.getMaintenanceSheet)
  .patch(maintenanceSheetController.updateMaintenanceSheet)


router.route('/byEquipment').get(maintenanceSheetController.setMaintenanceId, maintenanceSheetController.getAllMaintenanceSheet);

router
  .route('/:maintenanceId/newSheet')
  .post(
    maintenanceSheetController.setMaintenanceId,
    maintenanceSheetController.createNewSheet,
  );

router
  .route('/:id/fillSheet')
  .patch(
    maintenanceSheetController.setMaintenanceId,
    maintenanceSheetController.updateMaintenanceSheet,
  );

router
  .route('/:id/validate')
  .patch(
    maintenanceSheetController.setMaintenanceId,
    maintenanceSheetController.validateMaintenanceSheet,
  );

router
  .route('/steps/:maintenanceId')
  .get(
  maintenanceSheetController.setMaintenanceId,
  maintenanceSheetController.getSteps,
);

router 
  .route('/steps/step/:stepId')
  .get(maintenanceSheetController.getOneStep)

router  
  .route('/steps/comment')
  .post(maintenanceSheetController.commentStep)
  
router
  .route('/steps/comments/:id')
  .get(maintenanceSheetController.getComments)

router
  .route('/steps/:stepId')
  .patch(
    maintenanceSheetController.actionStep
);

module.exports = router;
