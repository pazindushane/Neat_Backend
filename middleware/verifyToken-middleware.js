const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();
module.exports= function(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    // check if beaere is undefine
    if (typeof bearerHeader !== 'undefined') {
        // split space
        const bearer = bearerHeader.split(' ')
        // get token
        const bearerToken = bearer[1];
        // token verfication
        try {
            const  verified=jwt.verify(bearerToken,process.env.SECRETE_KEY)
            next();
        } catch (error) {
            res.status(400).send('Invalid Token');
        }
        // next middleware
       
    } else {
        res.status(401).json({
            responseCode: '401',
            responseMsg: 'Access Denied!',
            content: [{token:"plese provide a token to the accees this route"}]
        });
    }
}