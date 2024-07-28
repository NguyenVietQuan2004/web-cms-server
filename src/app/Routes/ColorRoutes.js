import express from 'express';
import { verifyLogin } from '../../utils/verifyLogin.js';
import { createColor, deleteColor, getAllColor, getColor, updateColor } from '../Controllers/ColorController.js';

const router = express();

router.get('/', getColor);
router.get('/getall', getAllColor);
router.put('/', verifyLogin, updateColor);
router.post('/', verifyLogin, createColor);
router.delete('/', verifyLogin, deleteColor);

export default router;
