const {Router} = require('express');
const router = Router();

const intents = require('../controller/intents.controller');

router.route('/')
    .get(intents.getAll)
    .post(intents.create)

router.route('/:id')
    .put(intents.updateById)

module.exports = router;