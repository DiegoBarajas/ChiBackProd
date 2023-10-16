const {Schema, model} = require('mongoose');

const schema = new Schema({
    date: {type: Date, required: true},
    cantidad: {type: Number, required: true},
    transaccion: {type: String, required: true},
    motivo: {type: String, required: true},
    tipo: {type: String, required: true},
    quien: {type: String, required: true},
},{
    timestamps: true    
});

module.exports = model('finanzas', schema);