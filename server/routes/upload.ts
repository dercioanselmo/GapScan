import express from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

router.post("/", upload.single("file"), async (req, res) => {
    try {
        console.log("📤 Upload request received");

        if (!req.file) {
            console.log("❌ No file received");
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log(`File received: ${req.file.originalname} (${req.file.size} bytes)`);

        // Check environment variables
        if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
            console.error("❌ Missing AWS environment variables");
            return res.status(500).json({ error: "Server configuration error" });
        }

        const key = `${Date.now()}-${req.file.originalname}`;

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: key,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            })
        );

        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        console.log("✅ Upload successful:", fileUrl);

        res.json({ key, url: fileUrl });
    } catch (err: any) {
        console.error("🔥 S3 Upload Error:", err);
        res.status(500).json({
            error: "Upload failed",
            message: err.message
        });
    }
});

export default router;