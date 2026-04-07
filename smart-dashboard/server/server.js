import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./authRoutes.js";
import taskRoutes from "./taskRoutes.js"; // 1. ДОЛЖЕН БЫТЬ ИМПОРТ
import noteRoutes from "./noteRoutes.js";
import leaderboardRoutes from "./leaderboardRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public')));
app.use('/src', express.static(path.join(__dirname, '../src')));

app.use(cors());
app.use(express.json());

// Роуты
app.use("/api", authRoutes);
app.use("/api/tasks", taskRoutes); // 2. ДОЛЖНА БЫТЬ ЭТА СТРОКА
app.use("/api/notes", noteRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));