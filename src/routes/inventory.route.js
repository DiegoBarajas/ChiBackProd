const {Router} = require('express');
const router = Router();

const controller = require('../controller/inventory.controller');

router.route('/')
    .get(controller.getAll)
    .post(controller.create)

router.route('/:id')
    .get(controller.getById)
    .put(controller.updateById)
    .delete(controller.deleteById)

module.exports = router;

