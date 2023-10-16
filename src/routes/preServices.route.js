const {Router} = require('express');
const router = Router();

const controller = require('../controller/preServices.controller');

router.route('/')
    .get(controller.getAll)
    .post(controller.addOne)

router.route('/:id')
    .put(controller.update)
    .delete(controller.delete)

module.exports = router;