import express from "express";
import {
    createTeam, joinTeam, getTeamsForUser, getTeam, leaveTeam
} from "../controllers/teamControllers.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createTeam);
router.post("/join", auth, joinTeam);
router.get("/", auth, getTeamsForUser);
router.get("/:teamId", auth, getTeam);
router.post("/leave", auth, leaveTeam);

export default router;
