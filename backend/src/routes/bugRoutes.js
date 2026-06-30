import express from "express";
import {
    createBug,
    getBugsForTeam, getBug,
    assignBug, unassignBug, resolveBug, deleteBug
} from "../controllers/bugControllers.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", auth, createBug);
router.get("/", auth, getBugsForTeam);
router.get("/:id", auth, getBug);
router.patch("/:id/assign", auth, assignBug);
router.patch("/:id/unassign", auth, unassignBug);
router.patch("/:id/resolve", auth, resolveBug);
router.delete("/:id", auth, deleteBug);

export default router;
