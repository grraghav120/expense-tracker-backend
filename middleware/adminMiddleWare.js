const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authentication;
        jwt.verify(token,process.env.ADMIN_JWT_KEY);
        next();
    }catch(error){
        res.status(401).json({
            message:'Auth Failed',
        })
    }
};
