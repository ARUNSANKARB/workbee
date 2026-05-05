import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected successfully")
    } catch (error) {
        console.log(`Database connection failed:${error.message}`);
        if(process.env.NODE_ENV=== 'production')
        {
            process.exit(1);
        }
        else{
            console.log("server is in development mode");
            return null;
        }   
    }
}

export default connectDB;