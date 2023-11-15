const {Schema, model} = require('mongoose');

const schema = new Schema({
    id_cliente: {type: String, required: true}, // Cliente que realizo la cotizacion
    device: {type: String, required: true}, // Dispositivo que se cotiza
    service: {type: String, required: true}, // Servicio que se cotiza
    date: {type: Date, required: true}, // Fecha de lacotizacion
    total: {type: Number, required: true}, // Costo del producto/servicio cotizado
    procedio: {type: Boolean, required: true, default: false} // Bool si procedio
},{
    timestamps: true
});

module.exports = model('cotizacion', schema);