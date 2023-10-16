const {Schema, model} = require('mongoose');

const schema = new Schema({
    intent: {type: String, required: true},
    keywords: {type: Array, required: true}
},{
    timestamps: true    
});

module.exports = model('intent', schema);