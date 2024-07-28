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

router.get('/', getProduct);
router.get('/getall', getAllProduct);
router.put('/', verifyLogin, updateProduct);
router.post('/', verifyLogin, createProduct);
router.delete('/', verifyLogin, deleteProduct);

export default router;
