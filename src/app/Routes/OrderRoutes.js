import express from 'express';
import { createOrder, deleteOrder, getAllOrder, updateOrder, overviewOrder } from '../Controllers/OrderController.js';
import { verifyLogin } from '../../utils/verifyLogin.js';
const router = express();

router.put('/', updateOrder);
router.post('/', createOrder);
router.delete('/', verifyLogin, deleteOrder);
router.get('/getall', verifyLogin, getAllOrder);
router.get('/overview', verifyLogin, overviewOrder);

export default router;
