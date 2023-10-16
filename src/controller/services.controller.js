const Services = require('../models/service.model');
const ctrl = {};

ctrl.getAll = async(req, res)=>{
    res.json(await Services.find());
}

ctrl.add = async(req, res)=>{
    const {device_id, name, price, keywords} = req.body;

    const services = await Services.find({
        device_id,
        name: name.toUpperCase()
    })

    if(services.length == 0){
        const kws = keywords.map((str) => str.toLowerCase());

        const newService = await new Services({
            device_id, 
            name: name.toUpperCase(), 
            price, 
            keywords: kws
        }).save().catch(err=>{
            res.json(err);
            return;
        });

        res.json(newService);
    }else{
        let keyw = [...services[0].keywords, ...keywords];
        keyw = keyw.map((str) => str.toLowerCase());

        res.json(await Services.findByIdAndUpdate(services[0].id,{
            name: name.toUpperCase(), 
            price, 
            keywords: keyw
        }))
        
    }
}

ctrl.getByDeviceId = async(req, res)=>{
    const { id } = req.params;

    const services = await Services.find();
    const ret = [];

    services.map(s=>{
        if(s.device_id == id)
            ret.push(s);
    });

    res.json(ret);
}

ctrl.update = async(req, res)=>{
    const { id } = req.params;
    const { name, price, keywords } = req.body;

    const kws = keywords.map((str) => str.toLowerCase());

    const updtService = await Services.findByIdAndUpdate(id,{
        name: name.toUpperCase(),
        price,
        keywords: kws
    }).catch(err=>{
        res.json(err);
        return;
    });

    res.json(updtService);
}

ctrl.delete = async(req, res)=>{
    const { id } = req.params;

    const delService = await Services.findByIdAndDelete(id)
    .catch(err=>{
        res.json(err);
        return;
    });

    res.json(delService);
}



module.exports = ctrl;