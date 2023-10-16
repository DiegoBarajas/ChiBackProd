const {Router} = require('express');
const router = Router();

const controller = require('../controller/user.controller');

router.route('/')
    .get(controller.getAll)
    .post(controller.createAccount)
    
router.route('/login')
    .put(controller.generatePassword)
    .post(controller.login)
    
router.route('/admin/:admin')
    .get(controller.getAllWhithAdmin)

router.route('/:id')
    .get(controller.getById)
    .put(controller.getByIdAndUpdate)

module.exports = router;