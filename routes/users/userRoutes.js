const express = require('express');

const router = express.Router();
const multer = require('multer')

const userController = require('../../controllers/usersControllers/userController');
const authController = require('../../controllers/usersControllers/authController');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
})

const upload = multer({ storage: storage})

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.use(authController.protect);
router.use(authController.isLoggedIn);

router.route('/profile').get(userController.getPersonnalData);
// router('/:userLogin/updateMe').post

router
  .route('/')
  .get(
    authController.restrictTo('admin', 'manager'),
    userController.getAllUser,
  );

// router.post("/upload-image", upload.single('image'), async (req, res) => {
//   console.log(req.body)
//   res.send("Uploaded")
// })

router.route("/upload-image").post(upload.single('image'), userController.uploadImgProfil);
router.route('/get-img-profil').get(userController.getImageProfil);


router.route('/newUser').post(authController.createNewUser);

router.route('/updatePassword')
  .post(userController.getUser);
  
router.route('/updatePassword2').patch(userController.updateUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
