const jwt = require("jsonwebtoken");

require("dotenv").config();

// [SECTION] Token Creation
module.exports.createAccessToken = user => {
    const data = {
        id : user._id,
        email : user.email,
        isAdmin : user.isAdmin
    }

    return jwt.sign(data, process.env.AUTH_SECRET_KEY, {})

}

// [SECTION] Token Verification
module.exports.verify = (req, res, next) => {
    console.log('Authorization Header:', req.headers.authorization);

    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.send({ auth: "Failed. No token." });
    } else {
        token = token.slice(7, token.length); // Remove 'Bearer ' from token
        console.log('Token after slicing:', token);

        jwt.verify(token, process.env.AUTH_SECRET_KEY, function (err, decodedToken) {
            if (err) {
                return res.status(403).send({
                    auth: "Failed",
                    message: err.message
                });
            } else {
                console.log("Decoded Token:", decodedToken);
                req.user = decodedToken;
                next();
            }
        });
    }
};

// [SECTION] Verify Admin
module.exports.verifyAdmin = (req, res, next) => {

    if(req.user.isAdmin) {

       next();
    } else {
        
    return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }
};


// [SECTION] Error Handler
module.exports.errorHandler = (err, req, res, next) => {
    console.log(err);

    const statusCode = err.status || 500;
    const errorMessage = err.message || "Internal Server Error";

    res.json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};

// [SECTION] Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
}
