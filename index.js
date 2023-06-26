const express =require('express');
const env = require("dotenv")
const bodyParser = require("body-parser");
const cors =require('cors')
const connectDB=require('./connectionDB.js')
const LinksRouter=require('./routers/LinksRouter.js')
const UserRouter=require('./routers/UserRouter.js')

const LinksController=require('./controllers/LinksController.js')
const UserController=require('./controllers/UserController.js')
const {checkVerify}=require('./middlewares/funcMidleWares.js')
connectDB()
const app=express()
const port=8000
app.use(cors()) 
app.use(bodyParser.json())

app.listen(port,()=>{
    console.log('example ');   
})
app.use('/links',LinksRouter)
app.use('/users',UserRouter)
app.use('/signin',UserController.signIn)
app.use('/login',UserController.logIn)
app.use('/:newUrl', LinksController.redirect);



