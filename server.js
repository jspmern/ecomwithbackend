import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
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
app.use("/api/v1/auth", authRoute);
app.listen(8080, () => {
  console.log(`server run at http://localhost:${process.env.PORT}/`);
});
