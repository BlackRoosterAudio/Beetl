// Prequisites
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Define Schema
var catalogueSchema   = new Schema({
    title       : String,
    project     : Schema.ObjectId,
    user        : Schema.ObjectId, // Creator
    data        : Schema.Types.Mixed,
    description : String,
    timestamp   : { type: Date, default: Date.now }
});

// Export model
module.exports = mongoose.model('catalogue', catalogueSchema);