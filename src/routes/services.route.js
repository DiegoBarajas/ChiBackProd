const {Router} = require('express');
const router = Router();
const Service = require('../controller/services.controller');

router.route('/')
    .get(Service.getAll)
    .post(Service.add)

router.route('/:id')
    .get(Service.getByDeviceId)
    .put(Service.update)
    .delete(Service.delete)

module.exports = router;