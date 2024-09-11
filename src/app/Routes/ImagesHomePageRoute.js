import express from 'express';
import { verifyLogin } from '../../utils/verifyLogin.js';
import {
    getImagesHomePage,
    CreateImagesHomePage,
    updateImagesHomePage,
} from '../Controllers/ImagesHomePageController.js';

const router = express();
router.get('/', getImagesHomePage);
router.put('/', verifyLogin, updateImagesHomePage);
router.post('/', verifyLogin, CreateImagesHomePage);

export default router;
