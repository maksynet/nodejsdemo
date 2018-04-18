var path = require('path');
var session = require('express-session');
var addNewUser = require('../models/user');
var newFollow = require('../models/follow');
var md5 = require('md5');
var userInfo = new addNewUser();
var userFollow = new newFollow();

module.exports.index = function(req, res) {
  if(req.session.oturum == true){
    res.redirect('/rooms');
  }else{
    res.render('index');
  }
};


module.exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};



function userLogin(req, res, v) {
  if(v == 0){
      var uname = req.body.userName,
          upass = req.body.userPass;
      if(uname != "" && upass != ""){
        addNewUser.find({ kadi: uname, sifre: upass }, function(err, result) {

          if (err) throw err;
          if(result != ""){
            req.session.oturum = true;
            req.session.userinfo = result;
            res.redirect('/rooms');
          }else{
            res.render('index');
          }
        });
      }
    }else if(v == 1){
      if(req.session.oturum == true){
        var id = req.session.userinfo[0]._id;
        addNewUser.findById(id, function (err, result) {
        if (err) return handleError(err);
          req.session.userinfo[0] = result;
          newFollow.find({'teden':req.session.userinfo[0].kadi}, function(err, myfollowers) {
          res.render('profile',{
            userinfo:req.session.userinfo,
            myfollowers: myfollowers
          });
        });
        });
      }else{
        res.redirect('/');
      }

    }
}

module.exports.profile = function(req, res) {
  userLogin(req, res, 1);
};

module.exports.indexLogin = function (req, res) {
  userLogin(req, res, 0);
}

module.exports.indexLoginGet = function (req, res) {
  res.redirect('/');
}
// ADD USERS

module.exports.indexPostNewUser = function(req, res) {
    if(req.body.adsoyad != "" && req.body.kadi != "" && req.body.cinsiyet != "" && req.body.email != "" && req.body.sifre == req.body.sifretekrar){

        userInfo.adsoyad  = req.body.adsoyad,
        userInfo.kadi     = req.body.kadi,
        userInfo.email    = req.body.email,
        userInfo.cinsiyet = req.body.cinsiyet,
        userInfo.sifre    = req.body.sifre,
        userInfo.token    = md5(req.body.adsoyad + req.body.kadi);

      userInfo.save(function (err) {
        res.redirect('/');
      });
    }

};
