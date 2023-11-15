const Finanzas = require('../models/finanzas.model');
const ctrl = {}

ctrl.getAll = async(req, res) => {
    res.json( await Finanzas.find() );
}

ctrl.create = async(req, res) => {
    const { date, cantidad, transaccion, motivo, tipo, quien } = req.body;

    

    console.log( date, cantidad, transaccion, motivo, tipo, quien );

    res.json({ñ: 'a'})
}


module.exports = ctrl;