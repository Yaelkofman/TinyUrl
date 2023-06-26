const express = require('express')
const jwt = require('jsonwebtoken')
require("dotenv").config();


//jwtSignאני עושה קודם קריאה ללוגין ולהרשמה ומיד אח"כ מעבירה ל
//זו לא פונ של מידלוואר

function jwtSign(req, res) {//signin--//login
    const token = jwt.sign({ password: req.body.password, email: req.body.email }, process.env.SECRET_JWT)
    console.log(token + "  token from jwt")
    res.status(200).json({ message: 'create token', token: token })
}

//לפני כל פונ שדורשת הרשאה מעבירה לפונ הזו כמידלוואר:
function checkVerify(req, res, next) { 
    try {
        console.log("come into checkverify")
        console.log(req.headers['authorization'])
        const cleanUser = jwt.verify(req.headers['authorization'], process.env.SECRET_JWT)
        if (cleanUser) {
            req.cleanUser = cleanUser
            return next()
        }
    } catch (error) {
        console.log("erroorr")
        res.status(401).send(error.message)
    }
}

module.exports = { checkVerify, jwtSign }

