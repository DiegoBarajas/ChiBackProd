const Devices = require('../models/device.model');
const Services = require('../models/service.model');
const {Router} = require('express');
const router = Router();

router.route('/')
    .post(addArray)

router.route('/:id')

module.exports = router;

async function addArray(req, res){
    const {devices, services} = req.body;
    const exitosos = [];
    const errores = [];

    for(let i=0;i<devices.length;i++){
        const device = await addDevice(devices[i])
        .catch(()=>{
            errores.push({
                index: i,
                device: devices[i],
                service: services[i]
            })
        })
        const service = await addService(device, services[i])
        .catch(()=>{
            errores.push({
                index: i,
                device: devices[i],
                service: services[i]
            })
        })

        exitosos.push({
            device,
            service
        });

    }

    res.json({
        exitosos,
        errores
    })
}

async function addDevice(service){
    const {name, keywords} = service;
    var error = false;

    const devices = await Devices.find({
        name: name.toUpperCase()
    })

    if(devices.length == 0){
        const kws = keywords.map((str) => str.toLowerCase());
        const sinDuplicados = [...new Set(kws)];

        const newDevice = await new Devices({
            name: name.toUpperCase(),
            keywords: sinDuplicados
        }).save().catch(err=>{
            error = true;
        });

        return new Promise((resolve, reject)=>{
            if(error){
                reject('Error');
            }else{
                resolve(newDevice);
            }
        })
    
    }else{
        let keyw = [...devices[0].keywords, ...keywords];
        keyw = keyw.map((str) => str.toLowerCase());
        const sinDuplicados = [...new Set(keyw)];

        const Device = await Devices.findByIdAndUpdate(devices[0].id,{
            name: name.toUpperCase(), 
            keywords: sinDuplicados
        }).catch(err=>{
            error = true;
        });

        return new Promise((resolve, reject)=>{
            if(error){
                reject('Error');
            }else{
                resolve(Device);
            }
        })
    }
}

async function addService(device, service){
    const {name, price, keywords} = service;
    const device_id = device.id;

    var error = false;

    const services = await Services.find({
        device_id,
        name: name.toUpperCase()
    })

    if(services.length == 0){
        const kws = keywords.map((str) => str.toLowerCase());
        const sinDuplicados = [...new Set(kws)];

        const newService = await new Services({
            device_id, 
            name: name.toUpperCase(), 
            price, 
            keywords: sinDuplicados
        }).save().catch(err=>{
            error = true;
        });

        return new Promise((resolve, reject)=>{
            if(error){
                reject('Error');
            }else{
                resolve(newService);
            }
        });

    }else{
        let keyw = [...services[0].keywords, ...keywords];
        keyw = keyw.map((str) => str.toLowerCase());
        const sinDuplicados = [...new Set(keyw)];

        const Service = await Services.findByIdAndUpdate(services[0].id,{
            name: name.toUpperCase(), 
            price, 
            keywords: sinDuplicados
        }).catch(err=>{
            error = true;
        });
        
        return new Promise((resolve, reject)=>{
            if(error){
                reject('Error');
            }else{
                resolve(Service);
            }
        });

    }
}