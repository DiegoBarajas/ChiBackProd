const {Router} = require('express');
const router = Router();
const controller = require('../controller/reparaciones.controller');

router.route('/')
    .get(controller.getAll)
    .post(controller.create)

router.route('/state/:state')
    .get(controller.getAllByState)

router.route('/pictures/:id')
    .put(controller.addPics)

router.route('/abono/:id')
    .put(controller.addAbono)

router.route('/delivery/:id')
    .get(controller.getAllByDelivery)
    .put(controller.asignToDelivery)

router.route('/:id')
    .get(controller.getById)
    .put(controller.updateState)

module.exports = router;