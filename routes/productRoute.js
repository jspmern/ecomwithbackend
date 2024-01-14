import express from 'express'
import { createProductController, deleteProductController, getProductController, imageHandlerController, singleProductController, updateProductController } from '../controller/productController.js'
import { isAdmin, requireSignIn } from '../middlware/authMiddlware.js'
import upload from '../config/multer.js'
let productRoute=express.Router()
//create-product || Post
productRoute.post('/create-product', requireSignIn,  isAdmin,  upload.array('image',4),createProductController)
//get-all-product || get
productRoute.get('/get-product',getProductController)
//get-single-product || get
productRoute.get('/single-product/:slug',singleProductController)
//get-image || get
productRoute.get('/product-image/:pid',imageHandlerController)
//delete-product || delete
productRoute.delete('/delete-product/:id',requireSignIn,isAdmin, deleteProductController)
//update-product || put
productRoute.put('/update-product/:id',requireSignIn,isAdmin,upload.array('images',4),updateProductController)
export default productRoute