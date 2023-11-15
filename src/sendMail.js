const transporter = require('./transporter');

const mail = {};

mail.sendTextMail = async(to, subjecto, text, successCallback, errorCallBack) => {
    const correo = {
        from: process.env.userGMail,
        to: to,
        subject: subjecto,
        text: text,
    };
    
    transporter.sendMail(correo, (error, info) => {
        if (error) {
          errorCallBack(error);
        } else {
          successCallback(info.response);
        }
    });
}

mail.sendHTMLMail = async(to, subjecto, HTML, successCallback, errorCallBack) => {
  const correo = {
      from: process.env.userGMail,
      to: to,
      subject: subjecto,
      html: HTML
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