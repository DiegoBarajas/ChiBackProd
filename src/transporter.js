const nodemailer = require('nodemailer');

// Configura el transporte de Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.userGMail,
      pass: process.env.passGMail,
    }
});

module.exports = transporter;