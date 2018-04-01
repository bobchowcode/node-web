var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type: String, required: true},
    type: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    featured: {type: Boolean}
});

module.exports = mongoose.model('Product', schema);