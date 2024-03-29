import { camparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../model/userModel.js";
import orderModel from '../model/orderModel.js'
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

//this is for update user profile
export let updateUserProfileController = async (req, res) => {
  try {
    let { name, email, address, password, phone } = req.body;
    let { _id } = req.user;
    let findUser = await userModel.findById({ _id });
    if (!password && password.length < 6) {
      return  res.json({ error: "Password is required and more then 6 digit" });
    }
    const hashedPassword = password? await hashPassword(password):undefined;
    let updateUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || findUser.name,
        password: hashedPassword || findUser.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      {
        new: true,
      }
    );
    res.status(200).send({
      message: "User is Updated successfully",
      success: true,
      updateUser: updateUser,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Somthing wrong while updating", success: true, err });
  }
};

//this is for the get-order details of specific user
export let getOrderController=async(req,res)=>{
  console.log('hello')
  try{
     let {_id}=req.user
     console.log(_id)
     let order = await  orderModel.find({buyer:_id}).populate('products').populate('buyer',"name")
     res.send(order)
  }
  catch{
       console.log(err)
       res.status(500).send({success:false,message:"Somthing wrong while fetching",err})
  }
}

//this is for the all-order for admin who can manage order
export let getAllOrderController=async (req,res)=>{
   try{
        let orders=await orderModel.find({}).populate("products")
        .populate("buyer", "name")
       
         res.status(200).send({message:"All Order",success:true,orders})

   }
   catch(err)
   {
    console.log(err)
    res.status(500).send({message:"Somthing Wrong, While Fetching",success:false,err})
   }
}


//this is for the change the order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
//this is for the all user controller
export let allUserController=async(req,res)=>{
  try{
        let users=await userModel.find({}).select("-answer -password")
        res.status(200).send({message:"All User",users,total_count:users.length})
  }
  catch(err)
  {
    console.log(err)
    res.status(500).send({message:"somthing wrong while fetching the data",err,success:false})
  }

}
//this is change role for user
export let changeRoleController= async(req,res)=>{
  try{
    let {id,role}=req.body
    let findData= await userModel.findByIdAndUpdate({_id:id},{role:role},{new:true})
    res.status(200).send({message:"Sucessfully Role Change",success:true})
  }
  catch(err)
  {
    console.log(err)
    res.status(500).send({message:"somthing wrong while fetching",err,success:false})
  }

}