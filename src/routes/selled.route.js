const {Router} = require('express');
const router = Router();

const controller = require('../controller/selled.controller');

router.route('/')
    .post(controller.create)
    .get(controller.getAll)

router.route('/:id')
    .get(controller.getById)
    .put(controller.getByIdAndUpdate)
    .delete(controller.getByIdAndDelete)

router.route('/date/:date')
    .get(controller.getAllWithDate)

router.route('/inventory/:id')
    .get(controller.getSelledByInventoryId)

router.route('/pay/:id')
    .put(controller.pay)

router.route('/documents/:id')
    .put(controller.addDocumets)

router.route('/warranty/:id')
    .put(controller.useWarranty)

module.exports = router;