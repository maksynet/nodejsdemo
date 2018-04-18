var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// ADD NEW USER
var userSchema = new Schema({
  adsoyad: String,
  kadi: String,
  email: String,
  cinsiyet: String,
  bio: String,
  orjinalPhoto: String,
  pathPhoto: String,
  presim: String,
  token: String,
  sifre: String
},{collection: 'users'});

var addNewUser = mongoose.model('users', userSchema);

module.exports = addNewUser;
