import express from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    getProduct,
    updateProduct,
} from '../Controllers/ProductController.js';
import { verifyLogin } from '../../utils/verifyLogin.js';

const router = express();

router.get('/', verifyLogin, getProduct);
router.put('/', verifyLogin, updateProduct);
router.post('/', verifyLogin, createProduct);
router.delete('/', verifyLogin, deleteProduct);
router.get('/getall', verifyLogin, getAllProduct);

export default router;
