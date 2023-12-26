import { camparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
export let registorController = async (req, res) => {
  try {
    const { name, email, phone, password, address, profilePicture, role } =
      req.body;

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
export let testController=(req,res)=>{ 
    res.send('protected route')
}