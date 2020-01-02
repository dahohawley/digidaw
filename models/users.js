const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    is_active: {
        type: Number,
        required: true,
        default: 0
    },
    created_dtm: {
        type: Date,
        default: Date.now()
    }
});


var verifyToken = (req, res, next) => {
    return new Promise((resolve, reject) => {
        token = req.headers['authorization'];
        console.log(token);
        if (token == null) {
            res.sendStatus(403);
        } else {
            jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
                if (err) return res.sendStatus(403)
                req.sessData = payload
                next()
            })
        }
    });
}

module.exports = mongoose.model('user', userSchema)
module.exports.verifyToken = verifyToken;