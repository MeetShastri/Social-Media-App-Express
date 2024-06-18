import jwt from 'jsonwebtoken';

export const verifyToken = async(req, res, next) => {
    try {
        const token = req.header('Authorization');
        if(!token){
            return res.status(403).json({
                message:'Access Denied',
            })
        }
        const verified = jwt.verify(token, process.env.SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })  
    }
}