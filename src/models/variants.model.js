const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true, unique: true},
    value: {type: JSON, required: true}
},{
    timestamps: true
});

module.exports = model('variant', schema);