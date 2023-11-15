const {Schema, model} = require('mongoose');

const schema = new Schema({
    inventory_id: {type: String, required: true},
    device: {type: String, required: true},
    serial: {type: String, required: true},
    characteristics: {type: String, required: true},
    description: {type: String, required: false, default: ''},
    price: {type: Number, required: true},

    buyer: {type: String, required: true},
    phone: {type: String, required: true},
    selledBy: {type: String, required: true},
    enganche: {type: Number, required: false},
    given: {type: Number, required: true},
    date: {type: String, required: true},
    referido: {type: String, required: false},
    comision: {type: Number, required: false},
    folio: {type: String, required: true},
    
    garantias: {type: Array, required: false},
    liquited: {type: Boolean, required: true},
    pics: {type: Array, required: false},
},{
    timestamps: true
});

module.exports = model('selled', schema);