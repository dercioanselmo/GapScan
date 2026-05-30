import express from "express";
import {
    S3Client,
    ListObjectsV2Command,
    DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const router = express.Router();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

router.post("/", async (_req, res) => {
    try {
        const bucket = process.env.S3_BUCKET_NAME!;

        const objects = await s3.send(
            new ListObjectsV2Command({
                Bucket: bucket,
            })
        );

        if (objects.Contents && objects.Contents.length > 0) {
            await s3.send(
                new DeleteObjectsCommand({
                    Bucket: bucket,
                    Delete: {
                        Objects: objects.Contents.map((obj) => ({
                            Key: obj.Key!,
                        })),
                    },
                })
            );
        }

        console.log("✅ S3 bucket wiped");

        res.json({
            success: true,
        });
    } catch (err: any) {
        console.error("🔥 Wipe Error:", err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

export default router;