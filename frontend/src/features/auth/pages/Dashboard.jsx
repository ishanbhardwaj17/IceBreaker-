import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../utils/api';
import { useAuth } from '../hooks/useAuth.js';
import { 
    ClipboardDocumentIcon, 
    CheckIcon, 
    ArrowLeftStartOnRectangleIcon, 
    ClockIcon,
    TagIcon,
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    ArrowPathIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const ResultCard = ({ title, content, type, copied, onCopy }) => {
    // Select icon based on output type
    const getIcon = () => {
        const iconClass = "w-5 h-5 text-neutral-300";
        switch (type) {
            case 'subject':
                return <TagIcon className={iconClass} />;
            case 'email':
                return <DocumentTextIcon className={iconClass} />;
            case 'linkedin':
                return <ChatBubbleLeftRightIcon className={iconClass} />;
            case 'followup':
                return <ArrowPathIcon className={iconClass} />;
            default:
                return <SparklesIcon className={iconClass} />;
        }
    };

    return (
        <div className="rounded-[1.75rem] border border-neutral-800 bg-[#0c0c0c] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)] mb-6 hover:border-neutral-700 transition-all duration-300 flex items-start gap-4">
            {/* Left Box: Icon Container matching reference image */}
            <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 shadow-sm">
                {getIcon()}
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3">
                    <h3 className="font-bold text-white text-lg tracking-tight pt-1">{title}</h3>
                    
                    {/* Copy button positioned like the close button in reference */}
                    <button
                        onClick={() => onCopy(content, type)}
                        className="text-neutral-500 hover:text-white transition-all p-2 rounded-lg hover:bg-neutral-900 active:scale-95 shrink-0"
                        title="Copy to clipboard"
                    >
                        {copied === type ? (
                            <CheckIcon className="w-5 h-5 text-neutral-100" />
                        ) : (
                            <ClipboardDocumentIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <div className="mt-3 rounded-xl border border-neutral-900/60 bg-[#050505] p-4.5">
                    <p className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed font-normal">
                        {content}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState('');
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    // Fetch history on load
    useEffect(() => {
        const fetchHistory = async () => {
            setHistoryLoading(true);
            try {
                const { data } = await api.get('/ai/history');
                setHistory(data);
            } catch (err) {
                console.error('Failed to fetch history:', err);
                toast.error('Unable to fetch history');
            } finally {
                setHistoryLoading(false);
            }
        };
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            const { data } = await api.post('/ai/generate-email', { prompt });
            setResult(data);
            setHistory(prev => [data, ...prev]);
            toast.success('Successfully generated outreach templates!');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to generate. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, type) => {
        try {
            navigator.clipboard.writeText(text);
            setCopied(type);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(''), 2000);
        } catch (e) {
            console.error(e);
            toast.error('Unable to copy');
        }
    };

    const onLogout = async () => {
        await handleLogout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const selectHistoryItem = (item) => {
        setResult(item);
        setPrompt(item.prompt);
        toast.success('Campaign loaded!');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
            {/* Header - Minimalist Mono Dark */}
            <header className="border-b border-neutral-900 bg-[#080808]/85 backdrop-blur-md py-4 px-6 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            <h1 className="text-xl font-bold tracking-wider text-white uppercase">OutreachAI</h1>
                        </div>
                        <p className="text-[11px] text-neutral-500 uppercase tracking-widest hidden sm:block">Monochromatic outreach intelligence</p>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="text-right hidden md:block border-r border-neutral-800 pr-5">
                            <p className="text-xs font-semibold text-neutral-400">Welcome, {user?.name || 'Explorer'}</p>
                            <p className="text-[10px] text-neutral-600 font-mono mt-0.5">{user?.email}</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-2 text-xs font-semibold tracking-wider text-neutral-400 hover:text-white hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-200 active:scale-95 uppercase"
                        >
                            <ArrowLeftStartOnRectangleIcon className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left side: Setup & History */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                    
                    {/* Setup Form */}
                    <div className="rounded-[1.75rem] border border-neutral-800 bg-[#0c0c0c] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
                        <h2 className="text-sm font-bold tracking-widest text-neutral-400 uppercase mb-4 flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-white" />
                            New Campaign
                        </h2>
                        
                        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">Context or Job description</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="w-full h-36 rounded-xl p-3.5 text-sm bg-[#050505] border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all resize-none leading-relaxed"
                                    placeholder="e.g. SDE-2 backend engineer position at Linear. Highly experienced in system design, Redis, scaling REST APIs, and Go..."
                                    maxLength={2000}
                                />
                                <div className="text-right text-[9px] text-neutral-600 font-mono mt-1">
                                    {prompt.length}/2000
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading || !prompt.trim()}
                                className="w-full bg-white text-black font-bold py-3.5 px-4 rounded-xl shadow-md hover:bg-neutral-200 transition-all duration-300 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99] uppercase text-xs tracking-wider"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <span>Generate Output</span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* History Panel */}
                    <div className="flex-1 rounded-[1.75rem] border border-neutral-800 bg-[#0c0c0c] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex flex-col min-h-[250px] lg:min-h-0 lg:max-h-[calc(100vh-34rem)]">
                        <h2 className="text-sm font-bold tracking-widest text-neutral-400 uppercase mb-3 pb-3 border-b border-neutral-900 flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-neutral-400" />
                            Outreach History
                        </h2>
                        
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {historyLoading ? (
                                <div className="h-full flex items-center justify-center py-6">
                                    <div className="h-5 w-5 animate-spin rounded-full border border-neutral-800 border-t-white" />
                                </div>
                            ) : history.length > 0 ? (
                                history.map((item) => (
                                    <button
                                        key={item._id}
                                        onClick={() => selectHistoryItem(item)}
                                        className="w-full text-left rounded-xl p-3 border border-neutral-900 bg-neutral-950/40 hover:bg-neutral-900 hover:border-neutral-800 transition-all duration-200 group flex flex-col gap-1"
                                    >
                                        <p className="text-xs font-bold text-white group-hover:text-white line-clamp-1">
                                            {item.subject}
                                        </p>
                                        <p className="text-[10px] text-neutral-500 font-mono line-clamp-2 leading-relaxed">
                                            {item.prompt}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-neutral-600 text-[11px] py-12">
                                    <ClockIcon className="w-6 h-6 mb-2 opacity-20 text-white" />
                                    <span>No history items yet</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right side: Results */}
                <div className="lg:col-span-8 flex flex-col">
                    <div className="rounded-[1.75rem] border border-neutral-800 bg-[#0c0c0c] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex-1 flex flex-col">
                        {result ? (
                            <div className="flex-1 overflow-y-auto pr-1">
                                <h2 className="text-sm font-bold tracking-widest text-neutral-400 uppercase mb-5 pb-3 border-b border-neutral-900">
                                    Outreach Assets
                                </h2>
                                <ResultCard title="Subject Line" content={result.subject} type="subject" copied={copied} onCopy={copyToClipboard} />
                                <ResultCard title="Cold Email" content={result.emailBody} type="email" copied={copied} onCopy={copyToClipboard} />
                                <ResultCard title="LinkedIn DM" content={result.linkedInDM} type="linkedin" copied={copied} onCopy={copyToClipboard} />
                                <ResultCard title="Follow-up Email" content={result.followUpEmail} type="followup" copied={copied} onCopy={copyToClipboard} />
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 my-auto">
                                <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center mb-4 border border-neutral-800">
                                    <ClipboardDocumentIcon className="w-6 h-6 text-neutral-500" />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Workspace Ready</h3>
                                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                                    Describe your target role on the left to generate premium cold assets in seconds.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
