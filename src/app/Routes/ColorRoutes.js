import express from 'express';
import { createColor, deleteColor, getAllColor, getColor, updateColor } from '../Controllers/ColorController.js';
import { verifyLogin } from '../../utils/verifyLogin.js';

const router = express();

router.get('/', verifyLogin, getColor);
router.put('/', verifyLogin, updateColor);
router.post('/', verifyLogin, createColor);
router.delete('/', verifyLogin, deleteColor);
router.get('/getall', verifyLogin, getAllColor);

export default router;
