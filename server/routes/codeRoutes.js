const express=require('express');
const { saveCode, getCode } = require('../controllers/codeController');

const router=express.Router();

router.post('/save',saveCode);
router.get('/:roomid',getCode);

module.exports=router;