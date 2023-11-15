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

        const HTML = `
        <h3>Hola, aqui esta tu contraseña para iniciar sesión:</h3>
        <h4>${pass}</h4>

        <button><a href="https://dash-chipsi.vercel.app/login/${email}/${pass}"><h4>Redireccionar automaticamente</h4></a></button>
`

        if(!error){
            await sendHTMLMail(
                user.email, 
                'Contraseña de Chipsi', 
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