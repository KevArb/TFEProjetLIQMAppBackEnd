const express = require('express');

const router = express.Router();

const supplierController = require('../../controllers/equipmentControllers/supplierController');
const authController = require('../../controllers/usersControllers/authController');

router.use(authController.protect);
router.use(authController.isLoggedIn);
router.use(authController.restrictTo('admin', 'manager'));

router.route('/').get(supplierController.getAllSuppliers);
router.route('/newSupplier').post(supplierController.createSupplier);
router
  .route('/:id')
  .get(supplierController.getSupplier)
  .patch(supplierController.updateSupplier)
  .delete(supplierController.deleteSupplier);

router.route('/:id/archiveSupplier').patch(supplierController.archiveSupplier);

module.exports = router;
