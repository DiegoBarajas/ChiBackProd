const History = require('../models/history.model');
const controller = {};

controller.getAll = async(req, res)=>{
    res.json(await History.find().sort({ updatedAt: -1 }))
}

controller.changeAutoMessages = async(req, res)=>{
    const {id} = req.params;

    const historial = await History.findById(id);
    const chngHistory = await History.findByIdAndUpdate(id,{
        sendMessage: !historial.sendMessage
    }).catch((err)=>{
        res.json(err);
        return;
    })

    res.json(chngHistory);
}

controller.changeAutoMessages = async(req, res)=>{
    const {id} = req.params;

    const historial = await History.findById(id);
    const chngHistory = await History.findByIdAndUpdate(id,{
        sendMessage: !historial.sendMessage
    }).catch((err)=>{
        res.json(err);
        return;
    })

    res.json(chngHistory);
}

controller.clearMessages = async(req, res)=>{
    const {id} = req.params;

    const chngHistory = await History.findByIdAndUpdate(id,{
        messages: [],
        devices: [],
        services: [],
        direction: '',
        phone: '',
        schedule: '',
        state: 0
    }).catch((err)=>{
        res.json(err);
        return;
    })

    res.json(chngHistory);
}

controller.getWhoNeedsSupport = async(req, res) => {
    res.json(await History.find({soporte: true}))
}

controller.offSupport = async(req, res) => {
    const {id} = req.params;
    
    res.json(await History.findByIdAndUpdate(id, {
        soporte: false
    }));
}

module.exports = controller;