
const linksModel = require('../models/linksModel.js')
const usersModel = require('../models/usersModel.js')
//const UsersController = require('./UserController.js')
const LinksController = {
    addUrl: async (req, res) => {

        console.log("entrance addurl")
        const { origionalUrl, newUrl } = req.body
        console.log(origionalUrl, newUrl + " origionalUrl, newUrl ")
        try {
            //לבדוק כאן שהקישור לא כפול
            const check = await linksModel.findOne({ newUrl: newUrl })
            if (check != null) {
                console.log("the link exists")
                res.status(200).send("the link exists")
            }
            const together = await linksModel.create({ origionalUrl: origionalUrl, newUrl: newUrl })
            //שימי לב שע"י החילוץ של הטוקן יש לך ססמא ומייל לא יותר!
            console.log(req.cleanUser.password + "  req.cleanUser.password")
            await usersModel.findOneAndUpdate({ password: req.cleanUser.password }, { $push: { Links: together._id } })
            res.send(`http://localhost:8000/${newUrl}`);//לשלוף את זה מהריאקט
        }
        catch (e) {
            res.status(400).json({ message: e.message })
        }
    },
    //לא השתמשתי בפונ הזו
    getById: async (req, res) => {

        try {
            console.log(req.params.id);
            const link = await linksModel.findById({ _id: req.cleanUser.id })

            console.log(link);
            res.json(link)
        }
        catch (e) {
            res.status(400).json({ message: e.message })
        }
    },

    deleteLink: async (req, res) => {
        try {
            const { newUrl } = req.params;
            const link = await linksModel.findOneAndDelete({ newUrl });
            const user = await usersModel.findOne({ password: req.cleanUser.password });
            user.Links.pull(link._id);

            await user.save();
            res.status(200).send(" ookk");
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },
    updateLink: async (req, res) => {
        try {
            console.log("entrance updatelink")
            const { newUrl, updateUrl } = req.body
            const link = await linksModel.findOneAndUpdate({ newUrl: newUrl }, { newUrl: updateUrl }, { new: true });
            console.log(link + " link");
            res.json(link)

        }
        catch (e) {
            res.status(400).json({ message: e.message })
        }
    },


    redirect: async (req, res) => {
        try {
            const { newUrl } = req.params
            console.log(newUrl)
            console.log("entrance redirect   " + newUrl + "  newurl")
            // first check if it's in the big links array
            const url = await linksModel.findOne({ newUrl: newUrl })
            if (url == null) {
                return res.status(200).send("didnt find the short links in the links array")
            }

            //לעדכן את מערך הקליקים של הקישור הזה
            //מכיל מידע על הקליקים
            const date = new Date();
            const options = { timeZone: 'Asia/Jerusalem' };
            const formattedDate = date.toLocaleString('en-US', options);
            //הוספה לכל קליק מאיפה הגיע:
            const click = {
                insertedAt: formattedDate,
                ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                targetParamValue: req.query.t
            };
            await linksModel.findByIdAndUpdate(url._id, { $push: { clicks: click } });

            res.redirect(url.origionalUrl)
            // res.send(`http://localhost:8000/${newUrl}`);
            // }
        } catch (e) {
            console.log("an error")
            res.status(400).json({ message: e.message })
        }
    },
    addPlatform: async (req, res) => {
        try {
            //בהנחה שאין קומבינציה של קישור ישן וקישור חדש זהים יותר מפעם אחת במערך הלינקים.
            //ובהנחה שאין לאותו לקוח ערך זהה במערך הטארגטים.
            console.log("entrance addplatform")
            const { name, value, newUrl, origionalUrl } = req.body
            const findLink = await linksModel.findOne({ newUrl: newUrl, origionalUrl: origionalUrl })//by reference
            if (findLink == null)
                return res.status(400).send("didnt find links in the links array")

            const targetValues = findLink.targetValues;
            targetValues.push({ name: name, value: value });
            findLink.targetValues = targetValues;
            await findLink.save();
            console.log(findLink.targetValues)
            res.send(`http://localhost:8000/${newUrl}?t=${value}`);

            //return the new link with target|
        }
        catch (e) {
            console.log("an error in addPlatform")
            res.status(400).json({ message: e.message })
        }
    }


}
module.exports = LinksController