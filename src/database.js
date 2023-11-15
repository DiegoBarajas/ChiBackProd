const colors = require('colors/safe')
const mongoose = require('mongoose');
const Generator = require('./pdf/pdfGenerator');
require('dotenv').config();

const URI = process.env.MONGODB_URI
            ? process.env.MONGODB_URI
            : 'mongodb://127.0.0.1:27017/chat';

mongoose.connect(URI);

const connetion = mongoose.connection;
connetion.once('open', async()=>{
    console.log(colors.cyan('La base de datos se lanzó en '+URI));

    await Generator.polizaDeGarantia1("5361870965")
    await Generator.polizaDeGarantia2("5361870965")
    await Generator.ticketComprobantePago("5361870965")
    await Generator.ticketComprobanteServicio("5361870965")
    await Generator.ticketRecoleccion("5361870965")

    await Generator.polizaDeGarantiaVenta1("652421ad88f13270dac87aa9");
    await Generator.polizaDeGarantiaVenta2("652421ad88f13270dac87aa9");
    await Generator.ticketVenta("652421ad88f13270dac87aa9");
});
