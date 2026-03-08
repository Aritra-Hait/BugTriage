import Bug from "../models/Bug.js";
import TeamMembership from "../models/TeamMembership.js";
import User from "../models/User.js";
import { calculatePriority } from "../utils/calculatePriority.js";
import mongoose from "mongoose";

const isUserInTeam = async (userId, teamId) => {
    return await TeamMembership.exists({
        userId: new mongoose.Types.ObjectId(userId),
        teamId: new mongoose.Types.ObjectId(teamId)
    });
};


export const createBug = async (req, res) => {
    try {
        const { title, description, severity, teamId } = req.body;

        // user identity comes from auth middleware
        const userId = req.user.id;

        // Check team access
        const allowed = await isUserInTeam(userId, teamId);
        if (!allowed) {
            return res.status(403).json({ message: "Not a member of this team" });
        }

        const newBug = new Bug({
            title, description, severity, status: "OPEN", teamId, reportedBy: userId
        });

        const savedBug = await newBug.save();
        //  console.log("Bug created:", savedBug);
        res.status(201).json(savedBug);

    } catch (err) {
        console.error("Error creating bug", err);
        res.status(500).json({ message: "Failed to create bug" });
    }
};


export const getBugsForTeam = async (req, res) => {
    try {
        const teamId = req.query.teamId;
        const userId = req.user.id;

        const allowed = await isUserInTeam(userId, teamId);
        if (!allowed) {
            return res.status(403).json({ message: "Not a member of this team" });
        }

        const bugs = await Bug.find({ teamId })
            .populate("reportedBy", "name email");

        const prioritized = bugs
            .map(bug => ({
                ...bug.toObject(),
                priority: calculatePriority(bug),
                userName: bug.reportedBy?.name || "Unknown",
                userEmail: bug.reportedBy?.email || "Unknown"
            }))
            .sort((a, b) => {
                if (b.priority !== a.priority) {
                    return b.priority - a.priority;
                }
                return new Date(a.createdAt) - new Date(b.createdAt);
            });

        res.status(200).json(prioritized);

    } catch (err) {
        console.error("Error fetching bugs", err);
        res.status(500).json({ message: "Failed to retrieve bugs" });
    }
};

export const getBug = async (req, res) => {
    try {
        const bugId = req.params.id;
        const userId = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(bugId)) {
            return res.status(400).json({ message: "Invalid bug id" });
        }
        const bug = await Bug.findById(bugId)
            .populate("reportedBy", "name email");
        if (!bug) {
            return res.status(404).json({ message: "Bug not found" });
        }

        const allowed = await isUserInTeam(userId, bug.teamId);
        if (!allowed) {
            return res.status(403).json({ message: "Not authorized to view this bug" });
        }

        res.status(200).json({
            ...bug.toObject(),
            priority: calculatePriority(bug),
            userName: bug.reportedBy?.name || "Unknown",
            userEmail: bug.reportedBy?.email || "Unknown"
        });

    } catch (err) {
        console.error("Error fetching bug", err);
        res.status(500).json({ message: "Failed to retrieve bug" });
    }
};


export const resolveBug = async (req, res) => {
    try {
        const bugId = req.params.id;
        const userId = req.user.id;

        const bug = await Bug.findById(bugId);
        if (!bug) {
            return res.status(404).json({ message: "Bug not found" });
        }

        // Check team access
        const allowed = await isUserInTeam(userId, bug.teamId);
        if (!allowed) {
            return res.status(403).json({ message: "Not authorized" });
        }

        bug.status = "RESOLVED";
        await bug.save();

        res.status(200).json(bug);

    } catch (err) {
        console.error("Error resolving bug", err);
        res.status(500).json({ message: "Failed to resolve bug" });
    }
};

export const deleteBug = async (req, res) => {
    try {
        const bugId = req.params.id;
        const userId = req.user.id;

        // Validate bugId
        if (!mongoose.Types.ObjectId.isValid(bugId)) {
            return res.status(400).json({ message: "Invalid bug id" });
        }

        const bug = await Bug.findById(bugId);
        if (!bug) {
            return res.status(404).json({ message: "Bug not found" });
        }

        // Check team access
        const allowed = await isUserInTeam(userId, bug.teamId);
        if (!allowed) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Only reporter can delete
        if (!bug.reportedBy.equals(userId)) {
            return res.status(403).json({ message: "Only reporter can delete bug" });
        }

        await Bug.deleteOne({ _id: bugId });

        res.status(200).json({ message: "Bug deleted successfully" });

    } catch (err) {
        console.error("Error deleting bug", err);
        res.status(500).json({ message: "Failed to delete bug" });
    }
};