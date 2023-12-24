import express from "express";
//router object
let router = express.Router();
import { registorController,loginController,testController } from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlware/authMiddlware.js";

//routing

//REGISTER || METHOD POST
router.post("/register", registorController);

//LOGIN || POST
router.post('/login',loginController)

//Testing || GET
router.get('/test', requireSignIn, isAdmin, testController)

export default router;

