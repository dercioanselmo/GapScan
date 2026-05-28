export async function uploadToS3(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${import.meta.env.API_URL}/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("S3 upload failed");
    }

    return response.json();
}