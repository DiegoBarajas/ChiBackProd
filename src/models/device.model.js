const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true, unique: true},
    keywords: {type: Array, required: true}
},{
    timestamps: true    
});

module.exports = model('device', schema);