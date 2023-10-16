const {Router} = require('express');
const router = Router();
const Device = require('../controller/devices.controller');

router.route('/')
    .get(Device.getAll)
    .post(Device.add)

router.route('/:id')
    .put(Device.update)
    .delete(Device.delete)

module.exports = router;