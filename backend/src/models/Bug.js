import mongoose from "mongoose";

const BugSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    severity: {
        type: String,
        enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
        required: true
    },

    status: {
        type: String,
        enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
        default: "OPEN"
    },

    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
        index: true
    },

    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }

}, { timestamps: true });

export default mongoose.model("Bug", BugSchema);
