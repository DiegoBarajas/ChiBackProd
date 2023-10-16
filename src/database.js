const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.MONGODB_URI
            ? process.env.MONGODB_URI
            : 'mongodb://127.0.0.1:27017/chat';

mongoose.connect(URI);

const connetion = mongoose.connection;
connetion.once('open', ()=>{
    console.log('La base de datos se lanzó en '+URI);
});
