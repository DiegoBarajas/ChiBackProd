const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const Selled = require('../models/selled.model');
const Inventory = require('../models/inventory.model');
const { log } = require('console');

const controller = {};

controller.create = async(req, res) => {
    const {inventory_id, buyer, selledBy, referido, comision, date, enganche, phone} = req.body;
    const imgs = req.files;

    const inventory = await Inventory.findById(inventory_id);

    const pics = [];
    for (const img in imgs){
        var result = await cloudinary.uploader.upload(imgs[img].tempFilePath, {
            public_id: 'selled@'+Date.now(),
            resource_type: 'auto',
            folder: 'selled'
        }).catch(err => {
            console.log('Error: '+err);
            result = {url: 'https://res.cloudinary.com/dnrfswnwp/image/upload/v1675969168/empresas/1675969167546.jpg'}
        })

        await fs.unlink(imgs[img].tempFilePath, (err) => {
            if(err){
                console.log(err);
            }
        })

        pics.push(result.url);
    }

    await Inventory.findByIdAndUpdate(inventory_id, { selled: true, selledDate: date });

    const newSell = await new Selled({
        inventory_id: inventory_id,
        device: inventory.device,
        serial: inventory.serial,
        characteristics: inventory.characteristics,
        description: inventory.description,
        price: inventory.price,
        folio: await generarFolioUnico(),

        buyer, 
        phone,
        selledBy, 
        referido, 
        comision, 
        enganche,
        given: enganche, 
        date,
        liquited: (enganche >= inventory.price) ? true : false,
        pics
    }).save();
    
    res.json(newSell);
}

controller.getAllWithDate = async(req, res) => {
    const {date} = req.params;
    const fechaHoy = new Date(date);

    const año = fechaHoy.getFullYear()-1;
    const mes = String(fechaHoy.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaHoy.getDate()).padStart(2, '0');
    const fechaFormateada = `${año}-${mes}-${dia}`;

    const withWarranty = [];
    const withoutWarranty = [];

    const selleds = await Selled.find();
    selleds.map(s => {

        const fechaObjeto1 = new Date(fechaFormateada);
        const fechaObjeto2 = new Date(s.date);

        if (fechaObjeto1 > fechaObjeto2) {
            withoutWarranty.push(s);
        } else if (fechaObjeto1 <= fechaObjeto2) {
            withWarranty.push(s);
        }
    });

    res.json({
        withWarranty,
        withoutWarranty
    });
}

controller.getSelledByInventoryId = async(req, res) => {
    const {id} = req.params;
    const selled = await Selled.find({ inventory_id: id });

    res.json(selled[0]);
}

controller.getAll = async(req, res) => {
    res.json( await Selled.find() );
}

controller.getById = async(req, res) => {
    const {id} = req.params;

    res.json( await Selled.findById(id) );
}

controller.pay = async(req, res) => {
    const { id } = req.params;
    const { given } = req.body;

    const selled = await Selled.findById(id);

    res.json(await Selled.findByIdAndUpdate(id, {
        given: given,
        liquited: (given >= selled.price) ? true : false
    }));
}

controller.addDocumets = async(req, res) => {
    const {id} = req.params;
    const imgs = req.files;

    const selled = await Selled.findById(id);
    const pics = selled.pics;
    for (const img in imgs){
        var result = await cloudinary.uploader.upload(imgs[img].tempFilePath, {
            public_id: 'selled@'+Date.now(),
            resource_type: 'auto',
            folder: 'selled'
        }).catch(err => {
            console.log('Error: '+err);
            result = {url: 'https://res.cloudinary.com/dnrfswnwp/image/upload/v1675969168/empresas/1675969167546.jpg'}
        })

        await fs.unlink(imgs[img].tempFilePath, (err) => {
            if(err){
                console.log(err);
            }
        })

        pics.push(result.url);
    }

    res.send(await Selled.findByIdAndUpdate(id, {
        pics: pics
    }));

}

controller.useWarranty = async(req, res) => {
    const {id} = req.params;
    const data = req.body;
    const imgs = req.files;

    const pics = [];
    for (const img in imgs){
        var result = await cloudinary.uploader.upload(imgs[img].tempFilePath, {
            public_id: 'selled@'+Date.now(),
            resource_type: 'auto',
            folder: 'warranties'
        }).catch(err => {
            console.log('Error: '+err);
            result = {url: 'https://res.cloudinary.com/dnrfswnwp/image/upload/v1675969168/empresas/1675969167546.jpg'}
        })

        await fs.unlink(imgs[img].tempFilePath, (err) => {
            if(err){
                console.log(err);
            }
        })

        pics.push(result.url);
    }

    const selled = await Selled.findById(id);
    const warranties = selled.garantias;
    
    const newWarranty = {
        problem: data.problem,
        date: data.date,
        pics
    }

    warranties.push(newWarranty);

    res.json(await Selled.findByIdAndUpdate(id, {
        garantias: warranties
    }));

}

controller.getByIdAndUpdate = async(req, res) => {
    const {id} = req.params;
    const {newSelled} = req.body;

    newSelled.liquited = (newSelled.given >= newSelled.price) ? true : false;

    res.json(await Selled.findByIdAndUpdate(id, newSelled));

}

controller.getByIdAndDelete = async(req, res) => {
    const {id} = req.params;

    res.json(await Selled.getByIdAndDelete(id));
}

module.exports = controller;

function hasPasedAYear(date1, date2){
    const diferenciaMilisegundos = date2 - date1;

        const milisegundosEnUnAnioYUnDia = 365 * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000;

        if (diferenciaMilisegundos >= milisegundosEnUnAnioYUnDia) {
            return true;
        } else {
            return false;
        }
}


async function generarFolioUnico() {
    let folio;
    let folioRepetido = true;
        
    while (folioRepetido) {
        // Genera un folio aleatorio de 10 dígitos
        folio = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        
        // Verifica si el folio ya existe en la base de datos
        const existeFolio = await Selled.exists({ folio });
        
        // Si no existe, salimos del bucle
        if (!existeFolio) {
        folioRepetido = false;
        }
    }
        
    return folio;
}