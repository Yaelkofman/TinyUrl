
const express=require('express')
const LinksController=require('../controllers/LinksController.js')
const {checkVerify}=require('../middlewares/funcMidleWares')

const LinksRouter=express.Router()
LinksRouter.post('/',checkVerify,LinksController.addUrl)
LinksRouter.get('/:id',LinksController.getById)
LinksRouter.delete('/:newUrl',checkVerify,LinksController.deleteLink)
LinksRouter.put('/',checkVerify,LinksController.updateLink)
LinksRouter.post('/platform',checkVerify,LinksController.addPlatform)

module.exports=LinksRouter