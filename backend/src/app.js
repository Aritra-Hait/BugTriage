import express from "express";
import bugRoutes from "./routes/bugRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import cors from "cors";
const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use("/api/bugs", bugRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
export default app;
