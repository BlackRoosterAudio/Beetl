// Prequisites
var mongoose     = require('mongoose');
var sha1         = require('../vendor/crypto.sha1.js');
var Schema       = mongoose.Schema;

// Define Schema
var userSchema   = new Schema({
	name         : String,
	username     : String,
	password     : String,
	note         : String,
	isAdmin      : Boolean,
	osselect     : String,
	osinfo       : String,
	host         : String,
	soundcard    : String,
	bearer       : String,
	bearertstamp : String,
	timestamp    : { type: Date, default: Date.now }
});

/**
 * The function will salt a given password ot the
 * class member password and return the salted version
 * @param  {string} password
 * @return {string}
 */
userSchema.statics.saltPassword = function(password) {
	var saltedPassword = sha1(password + '::saltwithkurkuma');
	return saltedPassword;
};

/**
 * The function will return the bearer token
 * implemented as guid/uuid
 * @return {string}
 */
userSchema.statics.createBearer = function() {
	var d    = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

// Export model
module.exports = mongoose.model('user', userSchema);