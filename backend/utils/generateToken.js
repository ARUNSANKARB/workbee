import jwt from 'jsonwebtoken';

const generateToken = (userId,role) => {
    const token = jwt.sign(
        {
            id : userId,
            role : role
        },
        process.env.JWT_SECRET,
        {
            expiresIn : process.env.JWT_EXPIRY
        }
    )
    return token;
}

export default generateToken;
