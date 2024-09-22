import {
    getBillboard,
    createBillboard,
    deleteBillboard,
    getAllBillboard,
    updateBillboard,
} from '../Controllers/BillboardController.js';
import express from 'express';
import { verifyLogin } from '../../utils/verifyLogin.js';
const router = express();

router.get('/', getBillboard);
router.get('/getall', getAllBillboard);
router.put('/', verifyLogin, updateBillboard);
router.post('/', verifyLogin, createBillboard);
router.delete('/', verifyLogin, deleteBillboard);

export default router;
