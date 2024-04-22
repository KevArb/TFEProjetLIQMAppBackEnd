const express = require('express');

const router = express.Router();

const equipmentCatController = require('../../controllers/equipmentControllers/equipmentCatController');
const authController = require('../../controllers/usersControllers/authController');

router.use(authController.protect);
router.use(authController.isLoggedIn);

router.route('/').get(equipmentCatController.getAllEquipmentCats);

router
  .route('/newEquipmentCat')
  .post(equipmentCatController.createEquipmentCat);
router
  .route('/:id')
  .get(equipmentCatController.getEquipmentCat)
  .patch(equipmentCatController.updateEquipmentCat)
  .delete(equipmentCatController.deleteEquipmentCat);

router
  .route('/:id/archiveEquipmentCat')
  .patch(equipmentCatController.archiveEquipmentCat);

module.exports = router;
