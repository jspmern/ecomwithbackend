import express from "express";
//router object
let router = express.Router();
import { registorController,loginController,testController,userAuthController,forgetPasswordController,adminAuthController } from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlware/authMiddlware.js";

//routing

//REGISTER || METHOD POST
router.post("/register", registorController);

//LOGIN || POST
router.post('/login',loginController)

//Protected route || get
router.get('/user-auth', requireSignIn,userAuthController)

//FORGET-PASSWORD || POST
router.post('/forget-password',forgetPasswordController)

//protected route for admin || get
router.get('/admin-auth',requireSignIn,isAdmin,adminAuthController)

//Testing || GET
router.get('/test', requireSignIn, isAdmin, testController)

export default router;

