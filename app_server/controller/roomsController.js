var path = require('path');
var session = require('express-session');
var randomstring = require("randomstring");
var addNewUser = require('../models/user');
var newConver = require('../models/creatroom');
var newFollow = require('../models/follow');


var userInfo = new addNewUser();
var creatNewConver = new newConver();
var userFollow = new newFollow();

module.exports.rooms = function(req, res) {
  if(req.session.oturum == true){
    var id = req.session.userinfo[0]._id;
    addNewUser.findById(id, function (err, result) {
    if (err) return handleError(err);
      addNewUser.find({}, function(err, resultusers) {
        req.session.userinfo[0] = result;
          res.render('rooms',{
            userinfo:req.session.userinfo,
            usersOnline: resultusers
          });
      });
    });
  }else{
    res.redirect('/');
  }
}


module.exports.chatPage = function(req, res, socket) {
  if(req.session.oturum == true){
  var rName = randomstring.generate();
  var chatUs = req.params.user;
  var sometoresult = null;
  var id = req.session.userinfo[0]._id;
   // creatNewConver
    addNewUser.findById(id, function (err, result) { // my information
      req.session.userinfo[0] = result;
      addNewUser.findOne({'kadi':chatUs}, function(err, toresult){ // some user
        sometoresult = [toresult];
        addNewUser.find({}, function(err, resultusers) { // online users
            if (err) return handleError(err);
          newFollow.find({'teden':req.session.userinfo[0].kadi, 'tedilen': chatUs}, function(err, tfollow) { // user follow
              res.render('chat',{
                userinfo:req.session.userinfo,
                usersOnline: resultusers,
                someuser: sometoresult,
                followres: tfollow.length
              });
          });

        });
      });
    });
  }else{
    res.redirect('/');
  }
}
