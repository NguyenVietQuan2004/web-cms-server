import express from 'express';
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getCategory,
    updateCategory,
} from '../Controllers/CategoryController.js';
import { verifyLogin } from '../../utils/verifyLogin.js';
const router = express();

router.get('/', verifyLogin, getCategory);
router.put('/', verifyLogin, updateCategory);
router.post('/', verifyLogin, createCategory);
router.delete('/', verifyLogin, deleteCategory);
router.get('/getall', verifyLogin, getAllCategory);

export default router;
