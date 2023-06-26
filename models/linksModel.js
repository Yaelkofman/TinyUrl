
const mongoose=require("mongoose")
const Links = mongoose.Schema(
    {
        origionalUrl: {
            type: String,
            required: true
        },
        newUrl: {
            type: String,
            required: true
        },
        clicks: {
            type: [{
                insertedAt: {
                    type: Date,
                    default: Date.now
                },
                ipAddress: {
                    type: String,
                    required: true
                },
                targetParamValue:{
                    type:String
                }
            }],
            
            default: () => [{
                insertedAt: Date.now(),
                ipAddress: "0.0.0.0"
            }]
        },
        targetParamName:
        {
            type:String,
            default:"t"
        },
        targetValues:[
            {
                name:{
                    type:String
                },
                value:{
                    type:String
                }
            }
        ]

    }
)
module.exports = mongoose.model("linksModel", Links);