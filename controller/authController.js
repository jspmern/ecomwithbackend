import { camparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";

//this is for the registration
export let registorController = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      profilePicture,
      role,
      answer,
    } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is require" });
    }
    if (!email) {
      return res.send({ message: "email is require" });
    }
    if (!phone) {
      return res.send({ message: "phone no is require" });
    }
    if (!password) {
      return res.send({ emessage: "password is require" });
    }
    if (!address) {
      return res.send({ message: "Address is require" });
    }
    if (!answer) {
      return res.send({ message: "Answer is require" });
    }

    //check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Already Register please login",
      });
    }
    //registor user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      profilePicture,
      address,
      phone,
      password: hashedPassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};
//login
export let loginController = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(404)
        .send({ success: false, message: "Invalid email or password" });
    }
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    let match = await camparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    //token creation
    let token = await jwt.sign({ _id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.status(200).send({
      message: "login successfully",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
//testing
export let testController = (req, res) => {
  res.send("protected route");
};
//user Auth controller (this is for the protected route)
export let userAuthController = (req, res) => {
  res.send({ ok: true });
};
//this is for forgetpassword
export let forgetPasswordController = async (req, res) => {
  try {
    let { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New password is required" });
    }
    let user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({ message: "Wrong email or answer" });
    }
    let newHashPassword = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: newHashPassword });
    res.status(200).send({
      message: "Password Rest Successfully",
      success: true,
      message: "login successfully",
    });
  } catch (err) {
    console.log("somthing wrong");
    res.status(500).send({
      success: false,
      message: "somthing wrong",
      err,
    });
  }
};
//Admin router access with middlware(userlogin and who have token and role is admin)
export let adminAuthController = (req, res) => {
  res.send({ ok: true });
};
