import express from "express";
//router object
let router = express.Router();
import {
  registorController,
  loginController,
  testController,
  userAuthController,
  forgetPasswordController,
  adminAuthController,
  updateUserProfileController,
  getOrderController,
  getAllOrderController,
  orderStatusController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlware/authMiddlware.js";

//routing

//REGISTER || METHOD POST
router.post("/register", registorController);

//LOGIN || POST
router.post("/login", loginController);

//Protected route || GET
router.get("/user-auth", requireSignIn, userAuthController);

//FORGET-PASSWORD || POST
router.post("/forget-password", forgetPasswordController);

//protected route for admin || GET
router.get("/admin-auth", requireSignIn, isAdmin, adminAuthController);
//this is for update User ||PUT
router.put('/update-profile',requireSignIn,updateUserProfileController)
//Testing || GET
router.get("/test", requireSignIn, isAdmin, testController);
//order || GET
router.get('/order',requireSignIn,getOrderController)
//All-order // GET
router.get('/all-order',requireSignIn,isAdmin,getAllOrderController)

//chamge the status
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
export default router;
