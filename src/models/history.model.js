const {model, Schema} = require('mongoose');

const historySchema = new Schema({

    from: {type: String, required: true},
    name: {type: String, required: true},
    messages: {type:Array, required: true},
    devices: {type:Array, required: true},
    services: {type:Array, required: true},
    direction: {type: String, required: false},
    name: {type: String, required: false},
    phone: {type: String, required: false},
    schedule: {type: String, required: false},
    sendMessage: {type: Boolean, required: true, default: true},
    state: {type: Number, required: true, default: 0},
    lastCoti: {type: String, required: false},
    soporte: {type: Boolean, requires: false}
},{
    timestamps: true
});

module.exports = model('history', historySchema);