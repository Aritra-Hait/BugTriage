import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MONGODB Connected succesfully");
    } catch (err) {
        console.error("Error connecting to MONGODB : ", err);
        process.exit(1)
    }
}