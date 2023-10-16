const {Schema, model} = require('mongoose');

const schema = new Schema({
    id_cliente: {type: String, required: true},
    device: {type: String, required: true},
    service: {type: String, required: true},
    date: {type: Date, required: true},
    total: {type: Number, required: true},
    procedio: {type: Boolean, required: true, default: false}
},{
    timestamps: true
});

module.exports = model('cotizacion', schema);