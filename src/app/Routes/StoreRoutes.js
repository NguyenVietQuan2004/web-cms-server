import express from 'express';
import { createStore, deleteStore, getAllStore, getStore, updateStore } from '../Controllers/StoreController.js';
import { verifyLogin } from '../../utils/verifyLogin.js';
const router = express();

router.get('/', verifyLogin, getStore);
router.put('/', verifyLogin, updateStore);
router.post('/', verifyLogin, createStore);
router.delete('/', verifyLogin, deleteStore);
router.get('/getall', verifyLogin, getAllStore);

export default router;
