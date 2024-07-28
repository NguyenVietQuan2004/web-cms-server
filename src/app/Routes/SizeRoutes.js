import express from 'express';
import { createSize, deleteSize, getAllSize, getSize, updateSize } from '../Controllers/SizeController.js';
import { verifyLogin } from '../../utils/verifyLogin.js';

const router = express();

router.get('/', getSize);
router.get('/getall', getAllSize);
router.put('/', verifyLogin, updateSize);
router.post('/', verifyLogin, createSize);
router.delete('/', verifyLogin, deleteSize);

export default router;
