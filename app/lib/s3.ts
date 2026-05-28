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