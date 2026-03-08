import mongoose from "mongoose";
const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    joinCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, { timestamps: true });
export default mongoose.model("Team", TeamSchema);