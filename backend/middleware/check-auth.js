const jwt = require("jsonwebtoken");
// parse request and decide if request should continue or be rejected if not authorized

//function that is executed on an incoming request
module.exports = (req, res, next) => {
    //could also use query param req.query.auth
    try{
        const token = req.headers.authorization.split(" ")[1]; //"Bearer dkfjkafjaskdfjtoken"
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {
            email: decodedToken.email, 
            userId: decodedToken.userId 
        };
        //let request continue with next()
        next();
    } catch(err) {
        res.status(401).json({message: "You are not authenticated!"});
    }
};
