var express = require('express');
var user_router = express.Router();
const userController = require('../controllers/userController');

user_router.get('/', userController.test)

//Routes
user_router.get('/images', userController.getImages);
user_router.get('/videos', userController.getVideos);
user_router.get('/news', userController.getNews);
user_router.get('/events', userController.getEvents);

module.exports = user_router;
