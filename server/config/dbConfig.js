import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected successfully");
    }
    catch(err){
        console.log("DB connection error : ", err);
        process.exit(1);
    }
}

export default connectDb;
