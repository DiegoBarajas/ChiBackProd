const Cotizaciones = require('../models/cotizacion.model');
const ctrl = {}

ctrl.getAll = async(req, res) => {
    res.json( await Cotizaciones.find() );
}

module.exports = ctrl;