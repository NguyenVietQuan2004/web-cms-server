import jwt from 'jsonwebtoken';
import { accountsModel } from '../app/Models/AccountModel.js';

export const verifyLogin = (req, res, next) => {
    const accessToken = req.cookies.sessionToken || req.cookies.accessToken;
    if (accessToken) {
        jwt.verify(accessToken, process.env.CODE_SIGN_JWT, async (err, user) => {
            if (err) {
                return res.status(403).json('Token is not valid');
            }

            const userExist = await accountsModel.findOne({
                id: user,
            });
            if (!userExist) {
                return res.status(403).json({
                    statusCode: 403,
                    message: 'You are not authenticate.',
                    ok: false,
                    data: null,
                });
            }
            console.log(userExist);
            req.user = user;
            // user: id
            next();
        });
    } else {
        return res.status(403).json('You are not authenticated!!');
    }
};
