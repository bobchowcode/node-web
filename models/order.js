var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cart: { type: Object, required: true },
    address: { type: String, required: true },
    // name: {type: String, required: true},
    ccNo: { type: String, required: true }
});

schema.methods.encryptCCNo = function (ccNo) {
    return bcrypt.hashSync(ccNo, bcrypt.genSaltSync(5), null);
};

schema.methods.validCCNo = function (ccNo) {
    return bcrypt.compareSync(ccNo, this.ccNo);
};

module.exports = mongoose.model('Order', schema);