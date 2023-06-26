
const mongoose=require("mongoose")
const Users=mongoose.Schema(
    {
        name: {
            type: String,
        },
        email:{type:String},
        password:{type:String},
        //לבדוק אם המערך אמור להכיל רק ID
        Links:[{
            type: mongoose.Schema.Types.ObjectId, //id link
            ref: "linksModel"  
        }
        ]
    }
)
module.exports = mongoose.model("usersModel",Users);