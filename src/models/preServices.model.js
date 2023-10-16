const {Schema, model} = require('mongoose');

const schema = new Schema({
    alias: {type: String, required: true},
    name: {type: String, required: true},
    keywords: {type: Array, required: true}
},{
    timestamps: true
});

module.exports = model('preservicios', schema);