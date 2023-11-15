const {Schema, model} = require('mongoose');

const schema = new Schema({
    folio: {type: String, required: true},
    id_cliente: {type: String, required: false},
    device: {type: String, required: true},
    service: {type: String, required: true},
    date: {type: Date, required: true},
    total: {type: Number, required: true},
    state: {type: Number, required: true, default: 0},
    direction: {type: String, required: true, default: ''},
    name: {type: String, required: true, default: ''},
    phone: {type: String, required: true, default: ''},
    schedule: {type: String, required: true, default: ''},
    id_repartidor: {type: String, required: false},
    device_password: {type: String, required: false},
    abono: {type: Number, default: 0},
    pics1: {type: Array, required: false},
    pics2: {type: Array, required: false},
    pics3: {type: Array, required: false},
    nota: {type: String, required: false}
},{
    timestamps: true
});

module.exports = model('reparacion', schema);