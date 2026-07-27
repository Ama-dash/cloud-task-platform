const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    //Check if token exists

    if (!authHeader) {

    return res.status(401).json({
        message: "No token provided"
    });

}
    //Extract token
    const token = authHeader.split(" ")[1];  

    //Verify token
    try {

        const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    //Store user information
    req.user = decoded;

    //Continue request
    next();


        
    } catch (error) {

        return res.status(401).json({
            message:"Invalid token"
        });
        
    }


};


module.exports = authMiddleware;