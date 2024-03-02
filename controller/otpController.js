import otpModel from "../model/otpModel.js";
import userModel from "../model/userModel.js";
import { randomInt } from "crypto";
import jwt from "jsonwebtoken";

import transporter from "../config/nodemailer.js";
import mailGenerator from "../config/mailgun.js";

//this is for creating otp and sending to gmail
// export let otpGenrateHandler = async (req, res) => {
//   try {
//     let { email } = req.body;
//     let findEmail = await userModel.find({ email });
//     if (findEmail.length > 0) {
//       let otpExist = await otpModel.findOne({ email });
//       if (otpExist) {
//         res.status(200).send({ message: "Wait for while", success: false });
//       } else {
//         const otp = randomInt(100000, 1000000);
//         await new otpModel({ email, otp,user:findEmail[0]._id }).save();
//         let response = {
//           body: {
//             name: findEmail[0].name,
//             intro: "This for the otp login",
//             table: {
//               data: [
//                 {
//                   title: "For login otp",
//                   otp,
//                 },
//               ],
//             },
//             outro: "Looking forward to do more business",
//           },
//         };
//         let mail = mailGenerator.generate(response);
//         let message = {
//           from: process.env.USER_NAME,
//           to: findEmail[0].email,
//           subject: "otp",
//           html: mail,
//         };
//         transporter
//           .sendMail(message)
//           .then(() => {
//             return res
//               .status(200)
//               .send({ message: " you Recieve an otp", success: true });
//           })
//           .catch((err) => {
//             console.log(err);
//             res.send({
//               message: "Somthing wrong while sending otp",
//               err,
//               success: false,
//             });
//           });
//       }
//     } else {
//       res.status(500).send({ message: "Invalid Email", success: false });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ message: "somthing wrong !" });
//   }
// };
//this is for validating otp
// export let otpValiateHandler=async(req,res)=>{
//     try{
//       let {email,otp}=req.body
//       let findData= await otpModel.findOne({otp})
//        if(findData)
//        {
//           let userDetils=await userModel.findOne({email:email})
//           let token = await jwt.sign({ _id: userDetils.id }, process.env.SECRET_KEY, {
//             expiresIn: "7d",
//           });
//           res.status(200).send({
//             message: "login successfully",
//             success: true,
//             user: {
//               name: userDetils.name,
//               email: userDetils.email,
//               phone:userDetils.phone,
//               address: userDetils.address,
//               role: userDetils.role,
//             },
//             token,
//           });
//        }
//        else{
//         res.status(500).send({message:"Invalid otp",success:false})
//        }

//     }
//     catch(err)
//     {
//         console.log(err)
//         res.status(500).send({message:"Somthing wrong",success:false,err})

//     }
// }

export let otpGenrateHandler = async (req, res) => {
  try {
    let { email } = req.body;
    let existUser = await userModel.findOne({ email });
    if (existUser) {
      let existingOtp = await otpModel.findOne({ email });
      if (existingOtp) {
        return res
          .status(200)
          .send({ message: "Wait for while", success: false });
      } else {
        let otp = randomInt(100000, 1000000);
        await new otpModel({ otp, email, user: existUser._id }).save();
        //mailgen
        let response = {
          body: {
            name: existUser.name,
            intro: "This for the otp login",
            table: {
              data: [
                {
                  title: "For login otp",
                  otp,
                },
              ],
            },
            outro: "Looking forward to do more business",
          },
        };
        let mail = mailGenerator.generate(response);
        let message = {
          from: process.env.USER_NAME,
          to: existUser.email,
          subject: "otp",
          html: mail,
        };
        transporter
          .sendMail(message)
          .then(() => {
            return res
              .status(200)
              .send({ message: "You received otp", success: true });
          })
          .catch((err) => {
            return res
              .status(500)
              .send({ message: "Somthing wrong ", success: false, err });
          });
      }
    } else {
      return res
        .status(500)
        .send({ message: "Invailid email", success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Somthing wrong ", err, success: false });
  }
};
export let otpValiateHandler = async (req, res) => {
  try {
    let { email, otp } = req.body;
    let verifyOtp = await otpModel.findOne({ otp }).populate("user");
    if (verifyOtp) {
      //token creation
      let token = await jwt.sign(
        { _id: verifyOtp.user.id },
        process.env.SECRET_KEY,
        {
          expiresIn: "7d",
        }
      );
      return res.status(200).send({
        message: "login successfully",
        success: true,
        user: {
          name: verifyOtp.user.name,
          email: verifyOtp.user.email,
          phone: verifyOtp.user.phone,
          address: verifyOtp.user.address,
          role: verifyOtp.user.role,
        },
        token,
      });
    } else {
       return res.status(200).send({ message: "Otp Incorrect", success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Somthing wrong !", success: false, err });
  }
};
