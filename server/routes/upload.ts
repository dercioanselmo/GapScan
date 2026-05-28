import express from "express";
import multer from "multer";
import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

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

router.post(
    "/upload",
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    error: "No file uploaded",
                });
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

            res.json({
                key,
                url: fileUrl,
            });
        } catch (err) {
            console.error(err);

            res.status(500).json({
                error: "Upload failed",
            });
        }
    }
);

export default router;