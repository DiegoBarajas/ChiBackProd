const transporter = require('./transporter');

const mail = {};

mail.sendTextMail = async(to, subjecto, text, successCallback, errorCallBack) => {
    const html = `<h2>Hola, tu contraseña para iniciar sesion es:<br><br>${text}</h2>
     <button><a href="https://dash-chipsi.vercel.app/login/${to}/${text}"><h5>Redireccionar</h5></a></button>
    `
    
    const correo = {
        from: process.env.userGMail,
        to: to,
        subject: subjecto,
        html: html,
    };
    
    transporter.sendMail(correo, (error, info) => {
        if (error) {
          errorCallBack(error);
        } else {
          successCallback(info.response);
        }
    });
}

module.exports = mail;
