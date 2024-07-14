import jwt from 'jsonwebtoken';
export default function generatorToken(data) {
    return jwt.sign(data, process.env.CODE_SIGN_JWT);
}
