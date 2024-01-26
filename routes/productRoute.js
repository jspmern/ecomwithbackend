import express from 'express'
import { brainTreePaymentController, braintreeTokenController, categoryProductController, createProductController, deleteProductController, getProductController, imageHandlerController, perPageProductListController, productFilterController, productTotalcountController, searchProductController, similerProductController, singleProductController, updateProductController } from '../controller/productController.js'
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
//product-filter || POST
productRoute.post('/product-filter',productFilterController)
//Total Product Count || get
productRoute.get('/product-count',productTotalcountController)
//product per page || get
productRoute.get('/product-list/:page',perPageProductListController)
//this is for searching in product  || get
productRoute.get('/search/:keyword',searchProductController)
// this is for the similer product || get
productRoute.get('/similar/:p_id/:c_id',similerProductController)
//this for the product according to category || get
productRoute.get('/category-product/:slug',categoryProductController)

//payment-token ||get
productRoute.get("/braintree/token", braintreeTokenController);

//payment-order || post
productRoute.post("/braintree/payment",requireSignIn,brainTreePaymentController)
export default productRoute