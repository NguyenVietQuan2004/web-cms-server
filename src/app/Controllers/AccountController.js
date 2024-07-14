import generatorToken from '../../utils/generatorToken.js';
import { accountsModel } from '../Models/AccountModel.js';
import { v4 as uuidv4 } from 'uuid';

// [POST] /auth/register
export const register = async (req, res) => {
    try {
        const newUserFromClient = req.body;

        if (!newUserFromClient.email || !newUserFromClient.password || !newUserFromClient.userName) {
            return res.status(400).json({
                data: null,
                statusCode: 400,
                message: 'Information user is missing',
                ok: false,
            });
        }
        const userExist = await accountsModel.findOne({
            email: newUserFromClient.email,
        });
        if (userExist) {
            return res.status(400).json({
                data: null,
                statusCode: 400,
                message: 'Email is already exist.',
                ok: false,
            });
        }
        const user = await accountsModel(newUserFromClient);
        await user.save();
        res.status(200).json({
            statusCode: 200,
            ok: true,
            data: null,
            message: 'Register success.',
        });
    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Something went wrong.',
            ok: false,
            data: null,
        });
    }
};
// [POST] auth/login
export const login = async (req, res) => {
    try {
        const user = await accountsModel.findOne({
            email: req.body.email,
            password: req.body.password,
        });

        if (!user) {
            return res.status(401).json({ statusCode: 401, message: 'User is not exist', ok: false, data: null });
        }
        const token = generatorToken(user.id);
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        res.setHeader(
            'Set-Cookie',
            `accessToken=${token}; Path=/; HttpOnly; Expires=${oneYearFromNow.toUTCString()}; Secure; Partitioned; SameSite=None`,
        );

        res.status(200).json({
            data: {
                id: user.id,
                email: user.email,
                userName: user.userName,
                accessToken: token,
            },
            message: 'Login success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Login failed.',
            ok: false,
        });
    }
};

// [POST] /auth/loginwithfirebase
export const loginWithFirebase = async (req, res) => {
    console.log(req.body);
    try {
        const { token: accessToken, userName, id } = req.body;
        if (!accessToken || !userName || !id) {
            return res.status(400).json({
                data: null,
                statusCode: 400,
                message: 'Information user is missing',
                ok: false,
            });
        }
        console.log(111111111111111);

        let existUser = await accountsModel.findOne({
            id,
        });
        console.log(existUser);

        if (!existUser) {
            existUser = await accountsModel({
                userName,
                id,
            });
            await existUser.save();
        }

        const token = generatorToken(existUser.id);
        console.log(token);

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        res.setHeader(
            'Set-Cookie',
            `accessToken=${token}; Path=/; HttpOnly; Expires=${oneYearFromNow.toUTCString()}; Secure; Partitioned; SameSite=None`,
        );
        console.log(2222222222222);

        res.status(200).json({
            data: {
                id: existUser.id,
                email: existUser.email,
                userName: existUser.userName,
                accessToken: token,
            },
            message: 'Login success.',
            ok: true,
            statusCode: 200,
        });
        console.log(33333333333);
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Login failed.',
            ok: false,
        });
    }
};
