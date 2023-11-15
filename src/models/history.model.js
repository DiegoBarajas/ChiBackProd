const {model, Schema} = require('mongoose');

const historySchema = new Schema({

    from: {type: String, required: true}, // De quien es (WhatsApp ID)
    name: {type: String, required: false}, // Nombre del cliente
    messages: {type:Array, required: true}, // Historial de mensajes
    devices: {type:Array, required: true}, // Listado de devices
    services: {type:Array, required: true}, // Listado de services
    direction: {type: String, required: false}, // Direccion del cliente
    phone: {type: String, required: false}, // Numero de telefono
    schedule: {type: String, required: false}, // Horario donde se puede encontrar
    sendMessage: {type: Boolean, required: true, default: true}, // Se le puede mandar mensajes?
    state: {type: Number, required: true, default: 0}, // Estado de la conversacion
    lastCoti: {type: String, required: false}, // Ultima cotizacion
    soporte: {type: Boolean, requires: false} // Require soporte?
},{
    timestamps: true
});

module.exports = model('history', historySchema);