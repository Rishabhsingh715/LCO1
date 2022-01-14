const jwt = require('jsonwebtoken');

const auth = (req, res, next)=> {
    const token = req.cookies.token || req.body.token ||
    req.header('Authorization').replace('Bearer ', '') 
    
    if(!token){
        return res.status(403).send("token is missing");
        //exiting the application here so not using the next() here.
    }

    try {
       const decode = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decode);
        //this decoded info would be something about the user that is specific like id 
        //So, you can use it now further
        //using this we can create another property into the request object.
        req.user = decode;
        
    } catch (error) {
        return res.status(401).send("Invalid token");
    }
    return next();
};

module.exports = auth;
