const User = require('../models/user.model');
const { sendHTMLMail } = require('../sendMail');
const ctrl = {};

ctrl.createAccount = async(req, res) => {
    const {_id, email, name, gender, admin} = req.body;

    var error = false;
    const user = await User.findById(_id)
        .catch((err) => {

            res.json({
                message: "No se ha encontrado su usuario",
                error: err
            });

            error = true;
        })

    if(error){
        return;
    }

    if(user.admin){

        const newUser = await new User({
            email,
            name, 
            gender, 
            admin
        }).save()
            .catch((err) => {
                res.json({
                    message: "Ha ocurrido un error al crear el registro",
                    error: err
                })

                error = true;
            })

        if(!error){
            res.json(newUser)
        }

    }else{
        res.json({
            message: 'Permiso denegado'
        });
    }
}

ctrl.getAll = async(req, res) => {
    res.json(await User.find());
}

ctrl.generatePassword = async(req, res) => {
    const {email} = req.body;

    const users = await User.find( {'email': email} );

    if(users.length == 0){
        res.json({
            message: "No se encontro el correo para inciar sesión"
        })
    }else{
        const user = users[0];
        const pass = genPass(10);
        var error = false;

        const updatedUser = await User.findByIdAndUpdate(user.id, {
            password: pass
        }).catch((err) => {
            res.json({
                message: "Ha ocurrido un error al generar la contraseña",
                error: err
            })

            error = true;
        })       

        const HTML = 
`
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Correo Chipsi</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit&display=swap" rel="stylesheet">

        <style>
            *{
                margin: 0px;
                padding: 0px;
                font-family: 'Outfit', sans-serif;
            }

            .header{
                width: 100%;
                background-color: #5BDCB7;
                border-radius: 0px 0px 20px 20px;
            }

            .img-header{
                width: 200px;
                margin: auto;
                display: block;
            }

            .h2-header {
                margin-top: 20px;
                margin-bottom: 10px;
                color: white;
                width: 100%;
                text-align: center;
            }

            .p-header {
                color: white;
                font-weight: bold;
                width: 100%;
                text-align: center;
            }

            .content{
                width: 100%;
            }

            .p-passwd { 
                margin-top: 30px;
                font-size: 20px;
                text-align: center;
            }

            .button {
                background-color: #5BDCB7;
                border-radius: 100%;
                color: white;
                border: none;
                font-size: 15px;
                padding: 20px;
                cursor: pointer;
                font-weight: bold;

                display: block;
                margin: auto;
            }

            .addr {
                color: white;
                font-size: 20px;
                text-decoration: none;
            }
            
        </style>
    </head>
    <body>
        <div class="header">
            <br><br>
            <img src="https://res.cloudinary.com/dzajaf1mv/image/upload/v1700224283/general/sqhfafmt5ve5kjjltsv3.jpg" alt="Chipsi Logo" class="img-header">
            <br>
            <h2 class="h2-header">Hola!</h2>
            <p class="p-header">Aqui esta tu contraseña temporal para tu inicio de sesión:</p>
            <br>
        </div>

        <div class="content">
            <p class="p-passwd">${pass}</p>
            <br><br>
            <button class="button"><a style="color: white; text-decoration: none" class="addr" href="https://dash-chipsi.vercel.app/login/${email}/${pass}">Redireccionar automaticamente</a></button>
        </div>

    </body>
</html>
`

        if(!error){
            await sendHTMLMail(
                user.email, 
                'Contraseña de incio de sesión para Chipsi', 
                HTML,
                (response) => res.json({ success: true, message: response }),
                (error) => res.json({ success: false, message: error })
            )
        }

    }
}

ctrl.login = async(req, res) => {
    const {email, password} = req.body;

    const user = await User.find( {email, password} );

    if(user.length == 0){
        res.json({
            message: "Correo y/o contraseña incorrectos"
        })
    }else{
        res.json(user[0])
    }
}

ctrl.getAllWhithAdmin = async(req, res) => {
    const {admin} = req.params;

    res.json(await User.find({admin: admin}));

}

ctrl.getById = async(req, res) => {
    const {id} = req.params;
    var error = false;

    const delivery = await User.findById(id)
        .catch((err) => {
            res.json({
                message: 'No se encontro el usuario',
                error: err
            })

            error = true;
        });

    if(!error)
        res.json(delivery);
    
}

ctrl.getByIdAndUpdate = async(req, res) => {
    const {id} = req.params;
    const {user} = req.body;

    await User.findByIdAndUpdate(id, user)

    res.json(await User.findById(id));
}

module.exports = ctrl;

function genPass(longitud) {
    const caracteres = '0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm'; // Los dígitos del 0 al 9
    let contraseña = '';
  
    for (let i = 0; i < longitud; i++) {
        const caracterAleatorio = caracteres.charAt(
            Math.floor(Math.random() * caracteres.length)
        );
      contraseña += caracterAleatorio;
    }
  
    return contraseña;
}