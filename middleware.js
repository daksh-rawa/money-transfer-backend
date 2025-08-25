const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({
            msg: "Authorization header is missing or invalid"
        });
    }

    const token = authHeader.split(' ')[1];

    try{
        const decode =jwt.verify(token, JWT_SECRET);
        
        if (decode.userId){
            req.userId = decode.userId;
            
            // console.log("run1");
            next();
        } else {
            return res.status(403).json({ msg: "invalid token" })
        }
    }catch (err) {
        return res.status(401).json({});
    }
};

module.exports = {
    authMiddleware
};