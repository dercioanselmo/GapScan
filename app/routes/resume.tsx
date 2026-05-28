import {useParams} from "react-router";
import {useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useState, useEffect} from 'react';
import {Link} from "react-router";

export const meta = () =>([
    {title: 'GapScan | Review'},
    {name: 'description', content: 'Detailed overview of your resume'},
])

const Resume = () => {
    const { id } = useParams();
    const { auth, kv } = usePuterStore();
    const[imageUrl, setImageUrl] = useState('');
    const[resumeUrl, setResumeUrl] = useState('');
    const[feedback, setFeedback] = useState<any>(null);

    useEffect(() => {
        const loadResume = async () => {
            if (!id) return;

            const resumeData = await kv.get(`resume:${id}`);

            // kv.get returns the value directly, not wrapped in .data
            if (!resumeData) {
                console.error("Resume not found");
                return;
            }

            // Handle both string and object responses
            const data = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;

            setImageUrl(data.imagePath);
            setFeedback(data.feedback);
        }

        loadResume();
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 flex items-center justify-center">
                    {imageUrl ? (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] w-fit">
                            <img
                                className="w-full h-full object-contain rounded-2xl"
                                src={imageUrl}
                                alt="resume"
                            />
                        </div>
                    ) : (
                        <p>Loading resume image...</p>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Resume