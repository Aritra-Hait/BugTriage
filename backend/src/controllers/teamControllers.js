import Team from "../models/Team.js";
import TeamMembership from "../models/TeamMembership.js";
import Bug from "../models/Bug.js";
import crypto from "crypto";

export const createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({ message: "Team name is required" });
        }

        // Generate join code
        const joinCode = crypto.randomBytes(3).toString("hex").toUpperCase();

        // Check if join code already exists
        const existingCode = await Team.findOne({ joinCode });
        if (existingCode) {
            return res.status(400).json({ message: "Join code collision. Please try again." });
        }

        const team = await Team.create({
            name, description,
            joinCode
        });

        // Creator automatically joins the team
        await TeamMembership.create({
            userId,
            teamId: team._id,
            role: "ADMIN"
        });

        res.status(201).json(team);
    } catch (err) {
        console.error("Error creating team", err);
        res.status(500).json({ message: "Failed to create team" });
    }
};


export const joinTeam = async (req, res) => {
    try {
        let { joinCode } = req.body;
        const userId = req.user.id;
        joinCode = joinCode.trim().toUpperCase();
        const team = await Team.findOne({ joinCode });
        if (!team) {
            return res.status(404).json({ message: "Invalid join code" });
        }

        const alreadyMember = await TeamMembership.exists({
            userId,
            teamId: team._id
        });

        if (alreadyMember) {
            return res.status(400).json({ message: "Already a member of this team" });
        }

        await TeamMembership.create({
            userId,
            teamId: team._id,
            role: "REPORTER"
        });

        res.status(200).json({ message: "Joined team successfully", team });
    } catch (err) {
        console.error("Error joining team", err);
        res.status(500).json({ message: "Failed to join team" });
    }
};

export const leaveTeam = async (req, res) => {
    try {
        const { teamId } = req.body;
        const userId = req.user.id;

        const membership = await TeamMembership.findOne({ userId, teamId });
        if (!membership) {
            return res.status(404).json({ message: "Not a member of this team" });
        }

        // Last admin guard
        if (membership.role === "ADMIN") {
            const adminCount = await TeamMembership.countDocuments({
                teamId,
                role: "ADMIN"
            });
            if (adminCount === 1) {
                return res.status(400).json({
                    message: "You are the only admin. Transfer admin role to another member before leaving."
                });
            }
        }

        await TeamMembership.deleteOne({ userId, teamId });

        // count remaining members
        const remainingMembers = await TeamMembership.countDocuments({ teamId });

        if (remainingMembers === 0) {

            // delete all bugs belonging to the team
            await Bug.deleteMany({ teamId });

            // delete the team itself
            await Team.deleteOne({ _id: teamId });
        }

        res.status(200).json({ message: "Left team successfully" });
    } catch (err) {
        console.error("Error leaving team", err);
        res.status(500).json({ message: "Failed to leave team" });
    }
};

export const getTeamsForUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const memberships = await TeamMembership.find({ userId })
            .populate("teamId");

        // Filter out any null teams (in case a team was deleted)
        const teams = memberships
            .map(m => m.teamId)
            .filter(team => team !== null);
        //  console.log(teams);
        res.status(200).json(teams);
    } catch (err) {
        console.error("Error fetching user teams", err);
        res.status(500).json({ message: "Failed to retrieve teams" });
    }
};

export const getTeam = async (req, res) => {
    try {
        const userId = req.user.id;
        const { teamId } = req.params;

        const memberships = await TeamMembership.find({ userId, teamId })
            .populate("teamId");

        if (memberships.length === 0) {
            return res.status(404).json({ message: "Team not found or not a member" });
        }

        // Filter out any null teams (in case a team was deleted)
        const team = memberships
            .map(m => m.teamId)
            .filter(team => team !== null);
        //  console.log(team);
        res.status(200).json(team[0]);
    } catch (err) {
        console.error("Error fetching user teams", err);
        res.status(500).json({ message: "Failed to retrieve teams" });
    }
};

export const getTeamMembers = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.id;

        // Must be a member to view members
        const membership = await TeamMembership.findOne({ userId, teamId });
        if (!membership) {
            return res.status(403).json({ message: "Not a member of this team" });
        }

        const memberships = await TeamMembership.find({ teamId })
            .populate("userId", "name email");

        const members = memberships.map(m => ({
            userId: m.userId._id,
            name: m.userId.name,
            email: m.userId.email,
            role: m.role,
            joinedAt: m.createdAt
        }));

        res.status(200).json(members);
    } catch (err) {
        console.error("Error fetching team members", err);
        res.status(500).json({ message: "Failed to retrieve team members" });
    }
};

export const updateMemberRole = async (req, res) => {
    try {
        const { teamId, userId: targetUserId } = req.params;
        const requesterId = req.user.id;
        const { role } = req.body;

        // Validate role value
        if (!["ADMIN", "DEVELOPER", "REPORTER"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // Requester must be ADMIN
        const requesterMembership = await TeamMembership.findOne({
            userId: requesterId,
            teamId
        });
        if (!requesterMembership || requesterMembership.role !== "ADMIN") {
            return res.status(403).json({ message: "Only admins can change roles" });
        }

        // Target must be a member
        const targetMembership = await TeamMembership.findOne({
            userId: targetUserId,
            teamId
        });
        if (!targetMembership) {
            return res.status(404).json({ message: "User is not a member of this team" });
        }

        if (targetMembership.role === role) {
            return res.status(400).json({ message: "User already has this role" });
        }

        // Last admin guard — prevent demoting the last admin
        if (targetMembership.role === "ADMIN" && role !== "ADMIN") {
            const adminCount = await TeamMembership.countDocuments({
                teamId,
                role: "ADMIN"
            });
            if (adminCount === 1) {
                return res.status(400).json({
                    message: "Cannot demote the only admin. Promote another member first."
                });
            }
        }

        targetMembership.role = role;
        await targetMembership.save();

        res.status(200).json({
            userId: targetUserId,
            role: targetMembership.role,
            message: "Role updated successfully"
        });

    } catch (err) {
        console.error("Error updating member role", err);
        res.status(500).json({ message: "Failed to update role" });
    }
};

export const getMyRole = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.id;

        const membership = await TeamMembership.findOne({ userId, teamId }, "role");
        if (!membership) {
            return res.status(403).json({ message: "Not a member of this team" });
        }

        res.status(200).json({ role: membership.role });
    } catch (err) {
        console.error("Error fetching role", err);
        res.status(500).json({ message: "Failed to fetch role" });
    }
};