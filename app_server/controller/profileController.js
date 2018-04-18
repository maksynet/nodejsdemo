var path = require('path');
var session = require('express-session');
var multer  = require('multer');
var SHA256 = require("crypto-js/sha256");
var randomBytes = require('randombytes');
var addNewUser = require('../models/user');
var newFollow = require('../models/follow');


var storage = multer.diskStorage({
  destination: './public/img/users/',
  filename: function (req, file, cb) {
    randomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, SHA256(raw.toString('hex')) + path.extname(file.originalname))
    })
  }
})
var upload = multer({ storage : storage }).single('userPhoto');

var userInfo = new addNewUser();
var userFollow = new newFollow();

module.exports.config = function(req, res) {
  if(req.session.oturum == true){
    var id = req.session.userinfo[0]._id;
    addNewUser.findById(id, function (err, result) {
    if (err) return handleError(err);
      req.session.userinfo[0] = result;
      res.render('config',{
        userinfo:req.session.userinfo
      });
    });
  }else{
    res.redirect('/');
  }
}

module.exports.setFollow = function(req, res) {

   if(req.params.user != ""){
     var takipeden   = req.session.userinfo[0].kadi,
         takipedilen = req.params.user;
         userFollow.teden = takipeden,
         userFollow.tedilen = takipedilen

     newFollow.find({teden: takipeden, tedilen: takipedilen}, function (err, result) {
       if(result.length > 0){
         newFollow.findOneAndRemove({teden: takipeden, tedilen: takipedilen}, function (err) {
           if(err) return;
            res.send('0');
            res.end();
         });
       }else{
           userFollow.save(function (err) {
             if(err) return;
              res.send('1');
              res.end();
           });
         }
       });
   }else{
     res.send('hata');
   }
}

module.exports.configPost = function(req, res) {
  if(req.body.infoForm == 'infoForm'){
    var adsoyad = req.body.adsoyad,
        email = req.body.email,
        sifre = req.body.sifre,
        bio   = req.body.bio,
        id = req.session.userinfo[0]._id;

    if(adsoyad != "" && email != "" && sifre != "" && id != ""){
      addNewUser.findByIdAndUpdate(id, { $set: { adsoyad: adsoyad, email: email, sifre: sifre, bio: bio }}, { new: false }, function (err, result) {
        if (err) return handleError(err);
          res.redirect('/profile');
      });
    }
  }
}

module.exports.configUpload = function(req, res) {
  var id = req.session.userinfo[0]._id;
  upload(req,res,function(err) {
      if( req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png' ){
        addNewUser.findByIdAndUpdate(id, { $set: { orjinalPhoto: req.file.originalname, pathPhoto: req.file.filename,  }}, { new: false }, function (err, result) {
           if (err) return handleError(err);
            res.redirect('/profile');
         });
      }else{
        console.log('Sadece jpg ve png uzantılarını yükleyebilirsiniz');
      }
  });
}

module.exports.otherProfile = function(req, res) {
  if(req.session.oturum == true){
    var idk = req.params.user;
    addNewUser.findOne({kadi: idk}, function (err, result) {
    if (err) return handleError(err);

    if(result != null){
      var xuserdata = [result];
      var myProfileData = [{orjName: req.session.userinfo[0].adsoyad, orjPhoto: req.session.userinfo[0].pathPhoto}];
      newFollow.find({'teden':req.session.userinfo[0].kadi, 'tedilen': idk}, function(err, tfollow) { // user follow
          res.render('otherprofile',{
            xuinfo:xuserdata,
            myProfile: myProfileData,
            followres: tfollow.length
          });
        });
      }
    });
  }else{
    res.redirect('/');
  }
}
