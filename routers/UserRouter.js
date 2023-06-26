
const express=require('express')
const {checkVerify}=require('../middlewares/funcMidleWares')
const UsersController=require('../controllers/UserController')
const UserRouter=express.Router()
UserRouter.post('/',checkVerify,UsersController.addUser)
UserRouter.get('/getLst',checkVerify,UsersController.lst)
module.exports=UserRouter