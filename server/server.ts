// server/server.ts
import "dotenv/config";          // ← Add this at the top
import express from "express";
import cors from "cors";
import uploadRouter from "./routes/upload.js";

const app = express();
const PORT = 5001;

console.log("✅ Starting server...");

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.get("/", (req, res) => res.send("Server is running! ✅"));

app.use("/upload", uploadRouter);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    // Debug environment variables
    console.log("AWS_REGION:", process.env.AWS_REGION ? "✅ Loaded" : "❌ Missing");
    console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID ? "✅ Loaded" : "❌ Missing");
    console.log("S3_BUCKET_NAME:", process.env.S3_BUCKET_NAME ? "✅ Loaded" : "❌ Missing");
});