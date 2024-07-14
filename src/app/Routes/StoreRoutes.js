import express from 'express';
import { createStore } from '../Controllers/StoreController.js';
const router = express();

router.post('/', createStore);

export default router;
