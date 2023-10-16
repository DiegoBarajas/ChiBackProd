const {Schema, model} = require('mongoose');

const schema = new Schema({
    device: {type: String, required: true},
    serial: {type: String, required: true},
    characteristics: {type: String, required: true},
    description: {type: String, required: false, default: ''},
    cost: {type: Number, required: true},
    price: {type: Number, required: true},
    purchaseDate: {type: String, required: true},
    selled: {type: Boolean, required: true, default: false},
    selledDate: {type: String, required: false}
},{
    timestamps: true
});

module.exports = model('inventory', schema);