const express = require('express');

const router = express.Router();

const laboratoryController = require('../../controllers/laboratoryControllers/laboratoryController');
const authController = require('../../controllers/usersControllers/authController');

router.use(authController.protect);

router.use(authController.restrictTo('admin', 'manager'));

router.route('/').get(laboratoryController.getLaboratory);
router.route('/newLaboratory').post(laboratoryController.createLaboratory);
router
  .route('/:id')
  .get(laboratoryController.getLaboratory)
  .patch(laboratoryController.updateLaboratory)
  .delete(laboratoryController.deleteLaboratory);

router
  .route('/:id/archiveLaboratory')
  .patch(laboratoryController.archiveLaboratory);

module.exports = router;
