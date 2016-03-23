// Prequisites
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Define Schema
var projectSchema   = new Schema({
    title       : String,
    extLink     : String,
    description : String,
    timestamp : { type: Date, default: Date.now }
});

// Export model
module.exports = mongoose.model('project', projectSchema);