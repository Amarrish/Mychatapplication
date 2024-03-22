

import jwt from 'jsonwebtoken';

const generateTokenAndCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SKEY, {
        expiresIn: '15d'
    });

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        domain: 'localhost', 
        path: '/',            
    });

    return token;
};

export default generateTokenAndCookie;