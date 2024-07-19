import jwt from 'jsonwebtoken';
export const verifyLogin = (req, res, next) => {
    const accessToken = req.cookies.sessionToken || req.cookies.accessToken;
    if (accessToken) {
        jwt.verify(accessToken, process.env.CODE_SIGN_JWT, (err, user) => {
            if (err) {
                return res.status(403).json('Token is not valid');
            }
            req.user = user;
            // user: name, id,photoURL
            next();
        });
    } else {
        return res.status(403).json('You are not authenticated!');
    }
};
// ko bt no nhan sessionToken hay accesstoken
