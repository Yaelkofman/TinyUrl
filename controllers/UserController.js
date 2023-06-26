
const usersModel = require('../models/usersModel.js')
const pkg = require('body-parser')
const { json } = pkg;
const jwt = require('jsonwebtoken');
const linksModel = require('../models/linksModel.js');
require("dotenv").config();
const UsersController = {

    addUser: async (req, res) => {
        const { password, email, name } = req.body

        try {
            //בדיקה שמשתמש כזה אינו קיים:
            const user = await usersModel.findOne({ email: email, name: name, password: password })
            if (user != null) {
                res.status(200).send("the user exists")
            }
            const together = await usersModel.create({ password: password, email: email, name: name })
            res.json(together)
        }
        catch (e) {
            res.status(400).json({ message: e.message })
        }
    },
    //זו פונ שלא נדרשה אבל בכל זאת ניסיתי לעשות אותה. משום מה אני לא מבינה למה זה לא עובד.אשמח שהמורה תגיד לי מה הבעיה.
    // //מחזיר מערך של LINKS ללקוח הזה
    // lst: async (req, res) => {
    //     try {
    //         //console.log(req.body.email + "   email")
    //         //const list = await usersModel.findOne({ email: req.body.email })//בהנחה שאין אפשרות להכנס למייל יותר מאדם אחד.ניתן להוסיף בדיקה גם ססמא
    //         const list = await usersModel.findOne({ email: req.cleanUser.email })


    //         console.log("coming into lst" + list.Links)
    //         console.log(list + "print the array")
    //         // res.send(list)//check if it ok
    //         return (list.Links)

    //     }
    //     catch (e) {
    //         res.status(400).json({ message: e.message })
    //     }
    // },

    // lst: async (req, res) => {
    //     try {
    //         //console.log(req.body.email + "   email")
    //         //const list = await usersModel.findOne({ email: req.body.email })//בהנחה שאין אפשרות להכנס למייל יותר מאדם אחד.ניתן להוסיף בדיקה גם ססמא
    //         const user = await usersModel.findOne({ password: req.cleanUser.password })
    //         const links = user.Links.map(link => ({
    //             newUrl: link.newUrl,
    //             originalUrl: link.originalUrl
    //           }));
    //           res.status(200).send(links);
    //         } catch (error) {
    //           console.error(error);
    //           res.status(200).send( []);
    //         }
    lst: async (req, res) => {
        try {
            const user = await usersModel.findOne({ password: req.cleanUser.password }).populate('Links');
            const links = user.Links.map(link => ({
                newUrl: link.newUrl,
                originalUrl: link.originalUrl
            }));
            console.log(links + "  links")
            res.status(200).send(links);
        } catch (error) {
            console.error(error);
            res.status(200).send([]);
        }
    }
    ,

    jwtSign: async (req, res) => {//signin--//login
        console.log("come into jwt")
        const token = jwt.sign({ password: req.body.password, email: req.body.email, id: req.body.id }, process.env.SECRET_JWT)
        console.log(token + "  token")
        return { message: 'create token', token: token }
    },

    //יוצר משתמש חדש ואח"כ מעביר לJWT
    signIn: async (req, res) => {
        try {
            const { password, email, name } = req.body
            console.log("entrance signIn")
            //Checking whether the person does not exist
            const user = await usersModel.findOne({ email: email, name: name, password: password })
            if (user != null) {
                res.status(200).send("the user exists")
            } else {
                const newUser = await usersModel.create({ email: email, name: name, password: password })
                if (newUser == null) {
                    console.log("emptyyy")
                }
                console.log(newUser + "what i added newUser")
                const tokenResponse = await UsersController.jwtSign(req, res)
                console.log(tokenResponse + "the result")
                res.status(200).json(tokenResponse)

            }
        } catch (e) {
            console.log("couldnt add")
            res.status(400).json({ message: e.message })
        }
    },
    //אם מנסה להכנס עם משהו לא קיים ישר מעביר אותו להרשמה
    logIn: async (req, res) => {
        try {
            const { password, email, name } = req.body
            console.log("entrance login")
            const user = await usersModel.findOne({ email: email, name: name, password: password })
            if (user == null) {
                console.log("the user doesnt exist redirect to signin")
                UsersController.signIn(req, res)
            } else {
                //jwt:
                const tokenResponse = await UsersController.jwtSign(req, res)
                console.log(tokenResponse + "the result")
                res.status(200).json(tokenResponse)

            }
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }
}

module.exports = UsersController;