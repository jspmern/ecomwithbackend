import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
async function connectDB() {
  try {
    let conn = await mongoose.connect(
      `mongodb://127.0.0.1:${process.env.DB_PORT}/${process.env.DB_NAME}`
    );
    console.log(`connted to mongodb `);
  } catch (error) {
    console.log(`Error in MongoDb ${error}`);
  }
}
export default connectDB;
