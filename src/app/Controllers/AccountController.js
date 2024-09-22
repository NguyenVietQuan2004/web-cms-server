import { accountsModel } from '../Models/AccountModel.js';
import generatorToken from '../../utils/generatorToken.js';

//{
//  id?,
//  email?,
//  password?,
//  userName,
//  createAt,
//  updateAt,
//}

// [POST] /auth/register
export const register = async (req, res) => {
    try {
        const newUserFromClient = req.body;
        newUserFromClient.email = newUserFromClient.email.toLowerCase();
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
        const user = new accountsModel(newUserFromClient);
        await user.save();
        res.status(200).json({
            statusCode: 200,
            ok: true,
            data: null,
            message: 'Register success.',
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Something went wrong',
            ok: false,
            data: error,
        });
    }
};

// [POST] auth/login
export const login = async (req, res) => {
    try {
        const user = await accountsModel.findOne({
            email: { $regex: req.body.email, $options: 'i' },
            password: req.body.password,
        });

        if (!user) {
            return res
                .status(401)
                .json({ statusCode: 401, message: 'Email or passord is incorrect.', ok: false, data: null });
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
                userName: user.userName,
                accessToken: token,
            },
            message: 'Login success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong Login failed.',
            ok: false,
        });
    }
};

// [POST] /auth/loginwithfirebase
export const loginWithFirebase = async (req, res) => {
    try {
        const { accessToken, userName, id } = req.body;
        if (!accessToken || !userName || !id) {
            return res.status(400).json({
                data: null,
                statusCode: 400,
                message: 'Information user is missing',
                ok: false,
            });
        }
        let existUser = await accountsModel.findOne({
            id,
        });
        if (!existUser) {
            existUser = new accountsModel({
                userName,
                id,
            });
            await existUser.save();
        }
        const token = generatorToken(existUser.id);
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        res.setHeader(
            'Set-Cookie',
            `accessToken=${token}; Path=/; HttpOnly; Expires=${oneYearFromNow.toUTCString()}; Secure; Partitioned; SameSite=None`,
        );
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
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong Login failed.',
            ok: false,
        });
    }
};

//[POST] /signout
export const signOut = async (req, res) => {
    try {
        res.setHeader('Set-Cookie', `accessToken=; Path=/; HttpOnly; ; Secure; Partitioned; SameSite=None`);
        res.status(200).json({
            data: null,
            message: 'Logout success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.setHeader('Set-Cookie', `accessToken; Path=/; HttpOnly; ; Secure; Partitioned; SameSite=None`);
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong, automatic sign out .',
            ok: false,
        });
    }
};
