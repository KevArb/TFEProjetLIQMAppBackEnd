const express = require('express');

const router = express.Router();

const roomController = require('../../controllers/laboratoryControllers/roomController');
const authController = require('../../controllers/usersControllers/authController');

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'manager'));

router.route('/').get(roomController.getRoom);
router.route('/newRoom').post(roomController.createRoom);
router
  .route('/:id')
  .get(roomController.getRoom)
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

router.route('/:id/archiveRoom').patch(roomController.archiveRoom);

module.exports = router;
