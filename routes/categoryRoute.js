import express from 'express'
import { isAdmin, requireSignIn } from '../middlware/authMiddlware.js'
import { createCategoryController, deleteCategoryController, getAllCategoryController, singleCategoryController, updateCategoryController } from '../controller/categoryController.js'
let categoryRoute=express.Router()
//create-Category || Post
categoryRoute.post('/create-category',requireSignIn,isAdmin,createCategoryController)
//Update-Category || Put
categoryRoute.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)
//get-all-category || get
categoryRoute.get('/get-category',getAllCategoryController)
// single category Information || get
categoryRoute.get("/single-category/:slug",singleCategoryController)

//delete category || delete
categoryRoute.delete('/delete-category/:id',requireSignIn, isAdmin,deleteCategoryController)
export default categoryRoute;

