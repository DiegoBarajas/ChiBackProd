const Variant = require('../models/variants.model');
const ctrl = {};

ctrl.get = async(req, res) => {
    res.json( await Variant.find({ name: 'whatsapp' }) );
}

module.exports = ctrl;