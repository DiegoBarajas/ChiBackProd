const cloudinary = require('cloudinary').v2;
const Reparaciones = require('../models/reparacion.model');
const Servicios = require('../models/service.model');
const Dispositivos = require('../models/device.model');
const Users = require('../models/user.model');
const fs = require('fs');
const ctrl = {}

ctrl.getAll = async(req, res) => {
    res.json( await Reparaciones.find() )
}

ctrl.getById = async(req, res) => {
    const {id} = req.params;

    res.json( await Reparaciones.findById(id) );
}

ctrl.updateState = async(req, res) => {
    const {id} = req.params;
    const {state} = req.body;

    const rep = await Reparaciones.findByIdAndUpdate(id, {
        state: state
    });

    res.json(rep);
}

ctrl.addPics = async(req, res) => {
    const { id } = req.params;
    const {campo} = req.body;
    const imgs = req.files;

    const reparation = await Reparaciones.findById(id);

    var urls = [];
    if((reparation[campo] != undefined) && (reparation[campo].length > 0)) urls = reparation[campo];

    for (const img in imgs){
        var result = await cloudinary.uploader.upload(imgs[img].tempFilePath, {
            public_id: reparation._id+'@'+Date.now(),
            resource_type: 'auto',
            folder: campo
        }).catch(err => {
            console.log('Error: '+err);
            result = {url: 'https://res.cloudinary.com/dnrfswnwp/image/upload/v1675969168/empresas/1675969167546.jpg'}
        })

        
        await fs.unlink(imgs[img].tempFilePath, (err) => {
            if(err){
                console.log(err);
            }
        })

        urls.push(result.url);
    }

    const data = {};
    data[campo] = urls;

    await Reparaciones.findByIdAndUpdate(id, data)

    res.json( await Reparaciones.findById(id) )
    

}

ctrl.getAllByState = async(req, res) => {
    const {state} = req.params;

    res.json( await Reparaciones.find({ state: state }) );
}

ctrl.asignToDelivery = async(req, res) => {
    const {id} = req.params;
    const {_id} = req.body;

    var error = false;

    const delivery = await Users.findById(_id)
        .catch((err) => {
            res.json({
                message: 'No se encontro el usuario',
                error: err
            })

            error = true;
        });
    
    const reparation = await Reparaciones.findById(id)
        .catch((err) => {
            res.json({
                message: 'No se encontro la reparacion',
                error: err
            })

            error = true;
        });

    if(!error){
        res.json(await Reparaciones.findByIdAndUpdate(id, {
            id_repartidor: _id,
            state: 1
        }));
    }
}

ctrl.getAllByDelivery = async(req, res) => {
    const {id} = req.params;
    var error = false;

    const delivery = await Users.findById(id)
        .catch((err) => {
            res.json({
                message: 'No se encontro el usuario',
                error: err
            })

            error = true;
        });

    if(!error){
        res.json(await Reparaciones.find({ id_repartidor: id }));
    }
}

ctrl.addAbono = async(req, res) => {
    const {id} = req.params;
    const {abono} = req.body;

    res.json(await Reparaciones.findByIdAndUpdate(id, {
        abono: abono
    }));

}

ctrl.create = async(req, res) => {
    const { id_service, date, direction, name, phone, schedule } = req.body;
    var error = false;

    const service = await Servicios.findById(id_service)
        .catch(err => {
            res.json({
                message: "Hubo un error al encontrar el servicio",
                error: err
            })

            error = true;
        });

    if(!error){


        const device = await Dispositivos.findById(service.device_id)
        .catch(err => {
            res.json({
                message: "Hubo un error al encontrar el dispositivo",
                error: err
            })

            error = true;
        });

        if(!error){

            const newReparation = await new Reparaciones({
                date: date,
                direction: direction,
                name: name, 
                phone: phone,
                schedule: schedule,
                folio: await generarFolioUnico(),
                total: service.price,
                device: device.name,
                service: service.name
            }).save()
                .catch(err => {
                    res.json({
                        message: "Hubo un error al crear el registro",
                        error: err
                    })
    
                    error = true;
                });


            if(!error){
                res.json(newReparation);
            }

        }
    }
}


module.exports = ctrl;

async function generarFolioUnico() {
    let folio;
    let folioRepetido = true;
        
    while (folioRepetido) {
        // Genera un folio aleatorio de 10 dígitos
        folio = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        
        // Verifica si el folio ya existe en la base de datos
        const existeFolio = await Reparaciones.exists({ folio });
        
        // Si no existe, salimos del bucle
        if (!existeFolio) {
        folioRepetido = false;
        }
    }
        
    return folio;
}