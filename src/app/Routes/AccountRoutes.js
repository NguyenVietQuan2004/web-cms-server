import express from 'express';
import { login, loginWithFirebase, register } from '../Controllers/AccountController.js';

const router = express();

router.post('/login', login);
router.post('/register', register);
router.post('/loginwithfirebase', loginWithFirebase);

export default router;
