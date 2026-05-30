import { useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { kv } = usePuterStore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5001";

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "This will permanently delete ALL resumes and ALL files from S3. Continue?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);
            setMessage("Deleting S3 files...");

            const response = await fetch(`${API_URL}/wipe`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to wipe S3 bucket");
            }

            setMessage("Deleting KV data...");

            await kv.flush();

            setMessage("Application data wiped successfully");

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err: any) {
            console.error(err);
            setMessage(err.message || "Failed to wipe application data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">
                Wipe Application Data
            </h1>

            <button
                disabled={loading}
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-3 rounded-md cursor-pointer disabled:opacity-50"
            >
                {loading ? "Wiping..." : "Wipe App Data"}
            </button>

            {message && (
                <p className="mt-4 text-lg">
                    {message}
                </p>
            )}
        </main>
    );
};

export default WipeApp;