import express from 'express';
import { createSize, deleteSize, getAllSize, getSize, updateSize } from '../Controllers/SizeController.js';
import { verifyLogin } from '../../utils/verifyLogin.js';

const router = express();

router.get('/', verifyLogin, getSize);
router.put('/', verifyLogin, updateSize);
router.post('/', verifyLogin, createSize);
router.delete('/', verifyLogin, deleteSize);
router.get('/getall', verifyLogin, getAllSize);

export default router;
