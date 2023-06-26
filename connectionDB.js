
const mongoose=require("mongoose")

require("dotenv").config();
const url=process.env.MONGO_URL
const connectDB=async ()=>{
    await mongoose.connect(url)
}
const database=mongoose.connection

database.on('error',(error)=>{console.error();})

database.once('connected',()=>{console.log('database connected');})
module.exports = connectDB;