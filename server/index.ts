import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import { connectDB } from "./db/connect.js";
import auditRoute from "./routes/audit.js";
import leadRoute from "./routes/lead.js";
import reportRoute from "./routes/report.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "https://ai-spend-audit-client.vercel.app"
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/audit", auditRoute);
app.use("/api/reports", reportRoute);
app.use("/api/leads", leadRoute);

app.get("/check", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
