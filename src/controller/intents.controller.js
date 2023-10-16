const Intents = require('../models/intents.model');
const controller = {};

controller.getAll = async(req, res)=>{
    res.json(await Intents.find())
}

controller.create = async(req, res)=>{
    const { intent, keywords } = req.body;

    const newIntent = await new Intents({
        intent: intent,
        keywords: keywords
    }).save().catch((err)=>{
        res.json(err);
        return;
    })
    
    res.json(newIntent);
}

controller.updateById = async(req, res)=>{
    const { id } = req.params;
    const { intent, keywords } = req.body;

    const intentUptd = await Intents.findByIdAndUpdate(id,{
        intent: intent,
        keywords: keywords
    }).catch((err)=>{
        res.json(err);
        return;
    });

    res.json(intentUptd);
}


module.exports = controller;