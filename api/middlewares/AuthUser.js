const jwt = require('jsonwebtoken');

//VERIFY USER IF NOT LOGGED IN
const verifyUser = async (req, res, next) => {
    if(!req.session.userId) {
        return res.status(403).json({message: "Anda belum login"});
    }
    // const user = await User.findOne({
    //     userId: req.session.userId
    // });
    return next();
}

//VERIFY JWT TOKEN FOR PROTECTED API
const verifyToken = async(req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['authorization'];

    if(!token){
        return res.status(403).json({message: "Token dibutuhkan"});
    }

    try {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];

        const decodedData = jwt.verify(bearerToken, process.env.TOKEN_SECRET);
        req.user = decodedData.user;

    } catch (error) {
        return res.status(400).json({message: "Token tidak valid"});
    }
    return next();
}

module.exports = {
    verifyUser,
    verifyToken
} 