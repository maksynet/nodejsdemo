var express = require('express');
var router = express.Router();


// Controller Class
var loginController = require('../controller/loginController');
var profileController = require('../controller/profileController');
var roomsController = require('../controller/roomsController');


// GET

  // Login Controller
  router.get('/', loginController.index);
  router.get('/profile', loginController.profile);
  router.get('/login', loginController.indexLoginGet);
  router.get('/logout', loginController.logout);


  // Rooms Controller
  router.get('/rooms', roomsController.rooms);
  router.post('/profile/:user/setfollow', profileController.setFollow);



  // Profile Controller
  router.get('/config', profileController.config);
  router.get('/:user', profileController.otherProfile);
  router.get('/rooms/single/:user', roomsController.chatPage);

// POST
  // Login Controller
  router.post('/login', loginController.indexLogin);
  router.post('/', loginController.indexPostNewUser);
  router.post('/config', profileController.configPost);
  router.post('/config/upload', profileController.configUpload);


// MODULE EXPORTS
  module.exports = router;
