const Inventario = require('../models/inventory.model');
const controller = {};

controller.create = async(req, res) => {
    const {device, serial, characteristics, description, cost, price, purchaseDate} = req.body;

    const newInventory = await new Inventario({
        device,
        serial, 
        characteristics,
        description, 
        cost, 
        price, 
        purchaseDate
    }).save();

    res.json( newInventory );
}

controller.getAll = async(req, res) => {
    const selled = await Inventario.find({ selled: true });
    const dontSelled = await Inventario.find({ selled: false });

    res.json({
        selled,
        dontSelled
    });
}

controller.getById = async(req, res) => {
    const {id} = req.params;
    const {device, serial, characteristics, description, cost, price, purchaseDate} = req.body;

    res.json( await Inventario.findByIdAndUpdate(id, {
            device,
            serial, 
            characteristics,
            description, 
            cost, 
            price, 
            purchaseDate
        }) 
    );

} 

controller.updateById = async(req, res) => {
    const {id} = req.params;
    const {device, serial, characteristics, description, cost, price, purchaseDate} = req.body;

    res.json( await Inventario.findByIdAndUpdate(id, {
            device,
            serial, 
            characteristics,
            description, 
            cost, 
            price, 
            purchaseDate
        }) 
    );

}

controller.deleteById = async(req, res) => {
    const {id} = req.params;

    res.json( await Inventario.findByIdAndDelete(id) );

}

module.exports = controller;