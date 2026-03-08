import express from "express";
import bugRoutes from "./routes/bugRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();

const __dirname = path.resolve();
if (process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));
}
app.use(express.json());

app.use("/api/bugs", bugRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.use((req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

export default app;
