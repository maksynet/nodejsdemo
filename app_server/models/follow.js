var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// FOLLOW OR UNFOLLOW
var followScheme = new Schema({
  teden: String,
  tedilen: String
},{collection: 'followers'});

var newFollow = mongoose.model('followers', followScheme);

module.exports = newFollow;
