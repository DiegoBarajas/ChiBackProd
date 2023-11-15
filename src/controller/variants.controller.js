const Variant = require('../models/variants.model');
const ctrl = {};

ctrl.getByName = async(name) => {
    return await Variant.find({ name: name });
}

ctrl.create = async(name, value) => {
    return await new Variant({
        name, 
        value
    }).save();
}

ctrl.updateValue = async(name, value) => {
    const element = await Variant.findOneAndUpdate({name: name}, {
        value: value
    });

    return await Variant.findById(element.id);
}

module.exports = ctrl;