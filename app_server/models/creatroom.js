var mongoose = require('mongoose');

var Schema = mongoose.Schema;
 
// NEW CONVERSATIONS
var converSchema = new Schema({
  kim: String,
  kime: String,
  roomID: String
},{collection: 'conversations'});

var newConver = mongoose.model('conversations', converSchema);

module.exports = newConver;
