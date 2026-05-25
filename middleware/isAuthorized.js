import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

const isAuthorized = (req, res, next) => {
    const authHeader = req.headers.authorization;
    //check for headers if not return 401
    if(!authHeader) return res.sendStatus(401);

    const [scheme, token] = authHeader.split(' ');
    // check missing authorization name or missing token value
    if(scheme !== 'Bearer' || !token) return res.sendStatus(401);

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        return next();
    } catch {
        return res.sendStatus(401);
    }
};

export default isAuthorized;