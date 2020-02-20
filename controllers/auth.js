const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const auth = async(req, res, next) => {
    const token = req.headers.authorization.replace('Bearer ', '');

    const data = jwt.verify(token, process.env.JWT_KEY);
    try {
        const admin = await Admin.findOne({_id: data._id, 'tokens.token': token})
        if (!admin) {
            throw new Error();
        }
        req.admin = admin;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({error: 'Your\'re not authorised to access this'});
    }
}

module.exports = auth;