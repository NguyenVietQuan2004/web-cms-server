import express from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    getProduct,
    updateProduct,
    getAllProductById,
} from '../Controllers/ProductController.js';
import { verifyLogin } from '../../utils/verifyLogin.js';

const router = express();

router.get('/', getProduct);
router.get('/getall', getAllProduct);
router.post('/getall', getAllProductById);
router.put('/', verifyLogin, updateProduct);
router.post('/', verifyLogin, createProduct);
router.delete('/', verifyLogin, deleteProduct);

export default router;
