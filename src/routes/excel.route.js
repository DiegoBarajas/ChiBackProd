const {Router} = require('express');
const router = Router();

const { uploadExcel, createDeniedExcel, downloadDeniedExcel } = require('../controller/excel.controller');

router.route('/')
    .post(uploadExcel)

router.route('/denied')
    .post(createDeniedExcel)

router.route('/denied/:filename')
    .get(downloadDeniedExcel)

module.exports = router;