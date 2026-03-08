import express from "express";
import {
    createBug,
    getBugsForTeam, getBug,
    resolveBug, deleteBug
} from "../controllers/bugControllers.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", auth, createBug);
router.get("/", auth, getBugsForTeam);
router.get("/:id", auth, getBug);
router.patch("/:id/resolve", auth, resolveBug);
router.delete("/:id", auth, deleteBug);

export default router;
