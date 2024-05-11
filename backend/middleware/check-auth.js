const jwt = require("jsonwebtoken")

module.exports = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,'secret_password');
        next();

    } catch (error) {
        res.status(404).json({message:"Authorization fail"})
    }

}