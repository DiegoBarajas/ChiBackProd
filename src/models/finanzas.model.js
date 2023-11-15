const {Schema, model} = require('mongoose');

const schema = new Schema({
    date: {type: String, required: true}, //Fecha de la transaccion
    cantidad: {type: Number, required: true}, // Cantidad de la transaccion
    transaccion: {type: String, required: true}, // Que tipo fue (entrada o salida)
    motivo: {type: String, required: true}, // La razon o descripcion
    tipo: {type: String, required: true}, // Si fue en efectivo, tarjeta, etc...
    quien: {type: String, required: true}, // Quien hizo el movimiento
},{
    timestamps: true    
});

module.exports = model('finanzas', schema);