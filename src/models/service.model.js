const {Schema, model} = require('mongoose');

const schema = new Schema({
    device_id: {type: String, required: true},
    name: {type: String, required: true},
    price:  {type: String, required: true},
    keywords: {type: Array, required: true}
},{
    timestamps: true    
});

module.exports = model('service', schema);