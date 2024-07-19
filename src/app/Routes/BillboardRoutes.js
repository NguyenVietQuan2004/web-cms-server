import express from 'express';
import {
    createBillboard,
    deleteBillboard,
    getAllBillboard,
    getBillboard,
    updateBillboard,
} from '../Controllers/BillboardController.js';
import { verifyLogin } from '../../utils/verifyLogin.js';
const router = express();

router.get('/', verifyLogin, getBillboard);
router.put('/', verifyLogin, updateBillboard);
router.post('/', verifyLogin, createBillboard);
router.delete('/', verifyLogin, deleteBillboard);
router.get('/getall', verifyLogin, getAllBillboard);

export default router;
