import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import otpRoute from "./routes/otpRoute.js";
import  path from 'path'
let app = express();
//configure env
dotenv.config();
//database connection
connectDB();
//middleware
app.use(express.json());
app.use(morgan("dev"));
//routes
app.get('/',(req,res)=>{
  res.send('hello testing')
})
//auth route
app.use("/api/v1/auth", authRoute);
//category route
app.use('/api/v1/category',categoryRoute)
//product route
app.use('/api/v1/product',productRoute)
//otp
app.use('/api/v1',otpRoute)
app.listen(8080, () => {
  console.log(`server run at http://localhost:${process.env.PORT}/`);
});
