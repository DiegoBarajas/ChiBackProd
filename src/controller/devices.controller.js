const Devices = require('../models/device.model');
const Services = require('../models/service.model')
ctrl = {};

ctrl.getAll = async (req, res)=>{
    const devices = await Devices.find().sort({name: 1});
    const services = await Services.find();

    const Devs = [];

    devices.map((d) => {

        const Servs = [];
        services.map((s)=>{
            if(s.device_id == d.id){
                Servs.push(s)
            }
        })

        const json = {
            _id: d.id,
            name: d.name,
            keywords: d.keywords,
            services: Servs,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
            __v: d.__v
        }

        Devs.push(json);
    })

    res.json(Devs);
}

ctrl.add = async(req, res)=>{
    const {name, keywords} = req.body;

    if(name == '')
        res.json({
            codeName: 'El valor "name" no puede estar vacio'
        })
    else{
        const devices = await Devices.find({
            name: name.toUpperCase()
        })
    
        if(devices.length == 0){
            const kws = keywords.map((str) => str.toLowerCase());
    
            const newDevice = await new Devices({
                name: name.toUpperCase(),
                keywords: kws
            }).save().catch(err=>{
                res.json(err);
                return;
            });
        
            res.json(newDevice);
        }else{
            let keyw = [...devices[0].keywords, ...keywords];
            keyw = keyw.map((str) => str.toLowerCase());
    
            res.json(await Devices.findByIdAndUpdate(devices[0].id,{
                name: name.toUpperCase(), 
                keywords: keyw
            }))
        }
    }
    
}

ctrl.update = async(req, res)=>{
    const {id} = req.params;
    const {name, keywords} = req.body;

    if(name == '')
        res.json({
            codeName: 'El valor "name" no puede estar vacio'
        })
    else{
        const upd = await Devices.findByIdAndUpdate(id, {
            name, 
            keywords
        }).catch((err)=>{
            res.json(err);
            return;
        })
    
        res.json(upd);
    }

}

ctrl.delete = async(req, res)=>{
    const {id} = req.params;

    const services = await Services.find();
    const ret = [];

    services.map(s=>{
        if(s.device_id == id)
            ret.push(s)
    });

    ret.map(async(r)=>{
        await Services.findByIdAndDelete(r._id);
    })

    const del = await Devices.findByIdAndDelete(id)
    .catch((err)=>{
        res.json(err);
        return;
    })


    res.json(del);
}


module.exports = ctrl;