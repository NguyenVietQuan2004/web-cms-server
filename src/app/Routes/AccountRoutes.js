import express from 'express';
import { login, loginWithFirebase, register, signOut } from '../Controllers/AccountController.js';

const router = express();

router.post('/login', login);
router.post('/register', register);
router.post('/signout', signOut);
router.post('/loginwithfirebase', loginWithFirebase);

export default router;
