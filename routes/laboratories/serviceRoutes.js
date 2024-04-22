const express = require('express');

const router = express.Router();

const serviceController = require('../../controllers/laboratoryControllers/serviceController');
const authController = require('../../controllers/usersControllers/authController');

router.use(authController.protect);
router.use(authController.isLoggedIn);

router.route('/').get(serviceController.getAllServices);
router.route('/newService').post(serviceController.createService);
router
  .route('/:id')
  .get(serviceController.getService)
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

router.route('/:id/archiveService').patch(serviceController.archiveService);

module.exports = router;
