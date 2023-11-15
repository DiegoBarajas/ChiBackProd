const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true, unique: true}, // Nombre del dispositivo
    keywords: {type: Array, required: true} // Palabras claves para identificarlo
},{
    timestamps: true    
});

module.exports = model('device', schema);