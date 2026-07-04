import express from "express";
import {
    createTeam, joinTeam, getTeamsForUser, getTeam, leaveTeam, getTeamMembers, updateMemberRole, getMyRole
} from "../controllers/teamControllers.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createTeam);
router.post("/join", auth, joinTeam);
router.get("/", auth, getTeamsForUser);
router.get("/:teamId", auth, getTeam);
router.post("/leave", auth, leaveTeam);
router.get("/:teamId/members", auth, getTeamMembers);
router.patch("/:teamId/members/:userId/role", auth, updateMemberRole);
router.get("/:teamId/my-role", auth, getMyRole);

export default router;
