var express = require('express');
var admin_router = express.Router();
const adminController = require('../controllers/adminController')
const imageContoller = require('../controllers/imageController');
const auth = require('../middlewares/auth')

admin_router.post('/login', adminController.loginAdmin);
admin_router.post('/verifyToken', adminController.verifyToken);
admin_router.put('/updateUser/:_id', auth.verifyToken, adminController.updateUser);
admin_router.post('/uploadPhoto', auth.verifyToken, imageContoller.upload.single('image'), adminController.uploadPhoto);
admin_router.post('/gallery', adminController.addToGallery);
admin_router.post('/news', adminController.addNews);
admin_router.post('/events', adminController.addEvents);
admin_router.post('/delete_file', adminController.deleteDocument);
admin_router.post('/update_admin', adminController.updateUser);

module.exports = admin_router;
