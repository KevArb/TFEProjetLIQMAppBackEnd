const express = require('express');

const router = express.Router({ mergeParams: true });

const incidentController = require('../../controllers/incidentControllers/incidentController');
const authController = require('../../controllers/usersControllers/authController');

router.use(authController.protect);
router.use(authController.isLoggedIn);

router.route('/').get(incidentController.getAllIncidents);

router
  .route('/getIncidents')
  .get(
    incidentController.setEquipmentId,
    incidentController.getIncidentsByIdEquipment,
  );

router
  .route('/newIncident')
  .post(incidentController.setEquipmentId, incidentController.createIncident);
router
  .route('/:id')
  .get(incidentController.getIncidentDetails)
  .delete(incidentController.deleteIncident)
  .patch(incidentController.updateIncident);

router.route('/:id/newComment').post(incidentController.commentIncident);

router
  .route('/:id/closeIncident')
  .patch(
    authController.restrictTo('manager'),
    incidentController.closeIncident,
  );

router.route('/:id/commentIncident')
  .post(incidentController.commentIncident)
  .get(incidentController.setIncidentId, incidentController.getComments);


module.exports = router;
