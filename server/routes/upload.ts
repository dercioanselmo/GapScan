import express from "express";
import multer from "multer";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

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
            return res.status(400).json({
                error: "No file uploaded",
            });
        }

        console.log(
            `File received: ${req.file.originalname} (${req.file.size} bytes)`
        );

        if (
            !process.env.AWS_REGION ||
            !process.env.AWS_ACCESS_KEY_ID ||
            !process.env.AWS_SECRET_ACCESS_KEY ||
            !process.env.S3_BUCKET_NAME
        ) {
            console.error("❌ Missing AWS environment variables");

            return res.status(500).json({
                error: "Server configuration error",
            });
        }

        const key = `${Date.now()}-${req.file.originalname}`;

        // Upload to S3
        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            })
        );

        // Regular S3 URL
        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        // Generate signed URL
        const signedUrl = await getSignedUrl(
            s3,
            new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,
            }),
            {
                expiresIn: 3600, // 1 hour
            }
        );

        console.log("✅ Upload successful:", fileUrl);

        // Return signed URL too
        res.json({
            key,
            url: fileUrl,
            signedUrl,
        });

    } catch (err: any) {
        console.error("🔥 S3 Upload Error:", err);

        res.status(500).json({
            error: "Upload failed",
            message: err.message,
        });
    }
});

export default router;