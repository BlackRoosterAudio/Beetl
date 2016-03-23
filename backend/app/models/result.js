// Prequisites
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Define Schema
var resultSchema = new Schema({
    catalogue   : Schema.ObjectId,
    testedBy    : Schema.ObjectId, // Tester
    data  		: Schema.Types.Mixed,
    errorNote   : String,
    timestamp   : { type: Date, default: Date.now }
});

// Export model
module.exports = mongoose.model('result', resultSchema);