import { getMembership } from "../utils/getMembership.js";

/* Role-based authorization middleware. Currently unused. Reserved for future admin/team management routes.*/
// Usage: requireRole(["ADMIN"]) or requireRole(["ADMIN", "DEVELOPER"])
const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const teamId = req.params.teamId;

            const membership = await getMembership(userId, teamId);
            if (!membership) {
                return res.status(403).json({ message: "Not a member of this team" });
            }

            if (!allowedRoles.includes(membership.role)) {
                return res.status(403).json({ message: "Insufficient permissions" });
            }

            req.membership = membership;
            next();

        } catch (err) {
            console.error("Error checking role", err);
            res.status(500).json({ message: "Failed to verify permissions" });
        }
    };
};

export default requireRole;