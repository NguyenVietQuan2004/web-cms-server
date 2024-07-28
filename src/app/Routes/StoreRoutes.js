import express from 'express';
import { createStore, deleteStore, getAllStore, getStore, updateStore } from '../Controllers/StoreController.js';
import { verifyLogin } from '../../utils/verifyLogin.js';
const router = express();

router.get('/', verifyLogin, getStore);
router.get('/getall', verifyLogin, getAllStore);
router.put('/', verifyLogin, updateStore);
router.post('/', verifyLogin, createStore);
router.delete('/', verifyLogin, deleteStore);

export default router;
