import mongoose from "mongoose";

const TeamMembershipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    }
}, { timestamps: true });

// Prevent duplicate membership
TeamMembershipSchema.index({ userId: 1, teamId: 1 }, { unique: true });
export default mongoose.model("TeamMembership", TeamMembershipSchema);