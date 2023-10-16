const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    gender: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password:  {type: String, required: false},
    admin: {type: Boolean, required: true}
},{
    timestamps: true    
});

module.exports = model('user', schema);