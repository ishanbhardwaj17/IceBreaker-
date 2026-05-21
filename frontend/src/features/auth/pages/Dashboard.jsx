import { useState, useEffect, useRef } from 'react';
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
    const [leftPanelWidth, setLeftPanelWidth] = useState(42);
    const [topPanelHeight, setTopPanelHeight] = useState(34);
    const [activeResize, setActiveResize] = useState(null);
    const workspaceRef = useRef(null);
    const leftColumnRef = useRef(null);

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

    useEffect(() => {
        if (!activeResize) {
            return undefined;
        }

        const handlePointerMove = (event) => {
            if (activeResize === 'column' && workspaceRef.current) {
                const rect = workspaceRef.current.getBoundingClientRect();
                const nextWidth = ((event.clientX - rect.left) / rect.width) * 100;
                setLeftPanelWidth(Math.min(58, Math.max(28, nextWidth)));
            }

            if (activeResize === 'row' && leftColumnRef.current) {
                const rect = leftColumnRef.current.getBoundingClientRect();
                const nextHeight = ((event.clientY - rect.top) / rect.height) * 100;
                setTopPanelHeight(Math.min(52, Math.max(22, nextHeight)));
            }
        };

        const stopResize = () => {
            setActiveResize(null);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', stopResize);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', stopResize);
        };
    }, [activeResize]);

    return (
        <div className="h-screen overflow-hidden bg-[#050505] text-white flex flex-col font-sans">
            {/* Header - Minimalist Mono Dark */}
            <header className="border-b border-neutral-900 bg-[#080808]/85 backdrop-blur-md py-4 px-6 z-30 shrink-0">
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
            <div
                ref={workspaceRef}
                className={`flex-1 max-w-7xl w-full mx-auto p-4 md:p-5 overflow-hidden ${activeResize ? 'select-none' : ''}`}
            >
                
                <div className="hidden h-full lg:flex lg:gap-4">
                    {/* Left side: Setup & History */}
                    <div
                        ref={leftColumnRef}
                        className="flex h-full min-w-0 flex-col gap-4 overflow-hidden"
                        style={{ width: `${leftPanelWidth}%` }}
                    >
                    
                        {/* Setup Form */}
                        <div
                            className="min-h-0 overflow-hidden rounded-[1.75rem] border border-neutral-800 bg-[#0c0c0c] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
                            style={{ height: `${topPanelHeight}%` }}
                        >
                            <div className="flex h-full flex-col overflow-y-auto pr-1">
                                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400">
                                    <span className="h-1 w-1 rounded-full bg-white" />
                                    New Campaign
                                </h2>
                                
                                <form onSubmit={handleGenerate} className="flex flex-1 flex-col gap-4">
                                    <div className="flex-1">
                                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">Context or Job description</label>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            className="h-full min-h-36 w-full rounded-xl border border-neutral-800 bg-[#050505] p-3.5 text-sm leading-relaxed text-white placeholder:text-neutral-600 transition-all focus:border-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600"
                                            placeholder="e.g. SDE-2 backend engineer position at Linear. Highly experienced in system design, Redis, scaling REST APIs, and Go..."
                                            maxLength={2000}
                                        />
                                        <div className="mt-1 text-right font-mono text-[9px] text-neutral-600">
                                            {prompt.length}/2000
                                        </div>
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={loading || !prompt.trim()}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-md transition-all duration-300 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600 active:scale-[0.99]"
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
                        </div>

                        <button
                            type="button"
                            aria-label="Resize left sections"
                            onPointerDown={() => setActiveResize('row')}
                            className="flex h-3 shrink-0 items-center justify-center"
                        >
                            <span className="h-1.5 w-16 rounded-full bg-neutral-800 transition hover:bg-neutral-700" />
                        </button>

                        {/* History Panel */}
                        <div
                            className="min-h-0 overflow-hidden rounded-[1.75rem] border border-neutral-800 bg-[#0c0c0c] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
                            style={{ height: `${100 - topPanelHeight}%` }}
                        >
                            <div className="flex h-full flex-col">
                                <h2 className="mb-3 flex items-center gap-2 border-b border-neutral-900 pb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
                                    <ClockIcon className="h-4 w-4 text-neutral-400" />
                                    Outreach History
                                </h2>
                                
                                <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                                    {historyLoading ? (
                                        <div className="flex h-full items-center justify-center py-6">
                                            <div className="h-5 w-5 animate-spin rounded-full border border-neutral-800 border-t-white" />
                                        </div>
                                    ) : history.length > 0 ? (
                                        history.map((item) => (
                                            <button
                                                key={item._id}
                                                onClick={() => selectHistoryItem(item)}
                                                className="group flex w-full flex-col gap-1 rounded-xl border border-neutral-900 bg-neutral-950/40 p-3 text-left transition-all duration-200 hover:border-neutral-800 hover:bg-neutral-900"
                                            >
                                                <p className="line-clamp-1 text-xs font-bold text-white group-hover:text-white">
                                                    {item.subject}
                                                </p>
                                                <p className="line-clamp-2 font-mono text-[10px] leading-relaxed text-neutral-500">
                                                    {item.prompt}
                                                </p>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center py-12 text-[11px] text-neutral-600">
                                            <ClockIcon className="mb-2 h-6 w-6 text-white opacity-20" />
                                            <span>No history items yet</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label="Resize dashboard columns"
                        onPointerDown={() => setActiveResize('column')}
                        className="flex w-3 shrink-0 items-center justify-center"
                    >
                        <span className="h-20 w-1.5 rounded-full bg-neutral-800 transition hover:bg-neutral-700" />
                    </button>

                    {/* Right side: Results */}
                    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                        <div className="flex-1 overflow-hidden rounded-[1.75rem] border border-neutral-800 bg-[#0c0c0c] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
                            {result ? (
                                <div className="flex h-full flex-col overflow-y-auto pr-1">
                                    <h2 className="mb-5 border-b border-neutral-900 pb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
                                        Outreach Assets
                                    </h2>
                                    <ResultCard title="Subject Line" content={result.subject} type="subject" copied={copied} onCopy={copyToClipboard} />
                                    <ResultCard title="Cold Email" content={result.emailBody} type="email" copied={copied} onCopy={copyToClipboard} />
                                    <ResultCard title="LinkedIn DM" content={result.linkedInDM} type="linkedin" copied={copied} onCopy={copyToClipboard} />
                                    <ResultCard title="Follow-up Email" content={result.followUpEmail} type="followup" copied={copied} onCopy={copyToClipboard} />
                                </div>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center p-12 text-center">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900">
                                        <ClipboardDocumentIcon className="h-6 w-6 text-neutral-500" />
                                    </div>
                                    <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-white">Workspace Ready</h3>
                                    <p className="max-w-xs text-xs leading-relaxed text-neutral-500">
                                        Describe your target role on the left to generate premium cold assets in seconds.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex h-full flex-col gap-5 lg:hidden">
                    <div className="overflow-hidden rounded-[1.75rem] border border-neutral-800 bg-[#0c0c0c] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
                        <div className="flex max-h-[32vh] flex-col overflow-y-auto pr-1">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400">
                                <span className="h-1 w-1 rounded-full bg-white" />
                                New Campaign
                            </h2>
                            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                                <div>
                                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">Context or Job description</label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        className="h-36 w-full rounded-xl border border-neutral-800 bg-[#050505] p-3.5 text-sm leading-relaxed text-white placeholder:text-neutral-600 transition-all focus:border-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600"
                                        placeholder="e.g. SDE-2 backend engineer position at Linear. Highly experienced in system design, Redis, scaling REST APIs, and Go..."
                                        maxLength={2000}
                                    />
                                    <div className="mt-1 text-right font-mono text-[9px] text-neutral-600">
                                        {prompt.length}/2000
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={loading || !prompt.trim()}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-md transition-all duration-300 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600 active:scale-[0.99]"
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
                    </div>

                    <div className="overflow-hidden rounded-[1.75rem] border border-neutral-800 bg-[#0c0c0c] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
                        <div className="flex max-h-[28vh] flex-col">
                            <h2 className="mb-3 flex items-center gap-2 border-b border-neutral-900 pb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
                                <ClockIcon className="h-4 w-4 text-neutral-400" />
                                Outreach History
                            </h2>
                            <div className="flex-1 overflow-y-auto pr-1">
                                {historyLoading ? (
                                    <div className="flex h-full items-center justify-center py-6">
                                        <div className="h-5 w-5 animate-spin rounded-full border border-neutral-800 border-t-white" />
                                    </div>
                                ) : history.length > 0 ? (
                                    history.map((item) => (
                                        <button
                                            key={item._id}
                                            onClick={() => selectHistoryItem(item)}
                                            className="group mb-2 flex w-full flex-col gap-1 rounded-xl border border-neutral-900 bg-neutral-950/40 p-3 text-left transition-all duration-200 hover:border-neutral-800 hover:bg-neutral-900"
                                        >
                                            <p className="line-clamp-1 text-xs font-bold text-white group-hover:text-white">
                                                {item.subject}
                                            </p>
                                            <p className="line-clamp-2 font-mono text-[10px] leading-relaxed text-neutral-500">
                                                {item.prompt}
                                            </p>
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center py-12 text-[11px] text-neutral-600">
                                        <ClockIcon className="mb-2 h-6 w-6 text-white opacity-20" />
                                        <span>No history items yet</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden rounded-[1.75rem] border border-neutral-800 bg-[#0c0c0c] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
                        {result ? (
                            <div className="flex h-full flex-col overflow-y-auto pr-1">
                                <h2 className="mb-5 border-b border-neutral-900 pb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
                                    Outreach Assets
                                </h2>
                                <ResultCard title="Subject Line" content={result.subject} type="subject" copied={copied} onCopy={copyToClipboard} />
                                <ResultCard title="Cold Email" content={result.emailBody} type="email" copied={copied} onCopy={copyToClipboard} />
                                <ResultCard title="LinkedIn DM" content={result.linkedInDM} type="linkedin" copied={copied} onCopy={copyToClipboard} />
                                <ResultCard title="Follow-up Email" content={result.followUpEmail} type="followup" copied={copied} onCopy={copyToClipboard} />
                            </div>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center p-12 text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900">
                                    <ClipboardDocumentIcon className="h-6 w-6 text-neutral-500" />
                                </div>
                                <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-white">Workspace Ready</h3>
                                <p className="max-w-xs text-xs leading-relaxed text-neutral-500">
                                    Describe your target role to generate premium cold assets in seconds.
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
