import {useParams} from "react-router";
import {useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useState, useEffect} from 'react';
import {Link} from "react-router";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () =>([
    {title: 'GapScan | Review'},
    {name: 'description', content: 'Detailed overview of your resume'},
])

const Resume = () => {
    const { id } = useParams();
    const { auth, isLoading, kv } = usePuterStore();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            if (!id) return;

            const resumeData = await kv.get(`resume:${id}`);

            if (!resumeData) {
                console.error("Resume not found");
                return;
            }

            const data = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;

            setImageUrl(data.imagePath);
            setResumeUrl(data.resumePath ?? data.pdfPath ?? data.fileUrl ?? '');
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
                            {resumeUrl ? (
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                    <img
                                        className="w-full h-full object-contain rounded-2xl cursor-pointer"
                                        src={imageUrl}
                                        alt="resume"
                                    />
                                </a>
                            ) : (
                                <img
                                    className="w-full h-full object-contain rounded-2xl"
                                    src={imageUrl}
                                    alt="resume"
                                />
                            )}
                        </div>
                    ) : (
                        <p>Loading resume image...</p>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={{feedback}}/>
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}

export default Resume