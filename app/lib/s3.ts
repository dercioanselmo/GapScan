
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as signUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3Client";

export async function uploadToS3(file: File) {

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    if (!API_URL) {
        throw new Error("VITE_API_URL is not defined. Check your .env file.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => "Upload failed");
        throw new Error(`S3 upload failed: ${errorText}`);
    }

    return response.json();
}


export const getSignedUrl = async (key: string, expiresIn = 3600) => {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
    });

    const url = await signUrl(s3Client, command, {
        expiresIn, // seconds (default 1 hour)
    });

    return url;
};