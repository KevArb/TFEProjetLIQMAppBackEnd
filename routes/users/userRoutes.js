const express = require('express');

const router = express.Router();

const userController = require('../../controllers/usersControllers/userController');
const authController = require('../../controllers/usersControllers/authController');

router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Need to be logged to get access to the follow routes
router.use(authController.protect);

router.route('/profile').get(userController.getPersonnalData);
// router('/:userLogin/updateMe').post

router
  .route('/')
  .get(
    authController.restrictTo('admin', 'manager'),
    userController.getAllUser,
  );

router.route('/newUser').post(authController.createNewUser);

router.route('/updatePassword').patch(userController.updatePassword)
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
