import TeamMembership from "../models/TeamMembership.js";

// Returns the membership doc (with role) or null if not a member
export const getMembership = async (userId, teamId) => {
    return await TeamMembership.findOne({ userId, teamId });
};