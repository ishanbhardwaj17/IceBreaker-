import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import { useAuth } from '../hooks/useAuth.js';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { handleVerifyEmail, loading, error } = useAuth();
    const [otp, setOtp] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const userId = location.state?.userId;
    const email = location.state?.email || 'your email';

    if (!userId) {
        return (
            <AuthLayout
                eyebrow="Verification"
                title="Invalid Session"
                subtitle="It looks like you reached this page directly. Please sign up first."
            >
                <div className="text-center">
                    <Link
                        to="/register"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3.5 text-base font-medium text-black shadow-[0_10px_30px_rgba(255,255,255,0.14)] transition hover:translate-y-[-1px] hover:bg-white/95"
                    >
                        Go to Register
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        
        if (!/^\d{6}$/.test(otp)) {
            return;
        }

        try {
            await handleVerifyEmail({ userId, otp });
            setSuccessMessage('Email verified successfully! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch {
            // Error is handled in hook/redux
        }
    };

    return (
        <AuthLayout
            eyebrow="Security"
            title="Verify Email"
            subtitle={`We sent a 6-digit OTP code to ${email}. Please enter it below to activate your account.`}
            footer={
                <p className="text-center text-sm text-white/55">
                    Didn't receive a code?{' '}
                    <Link to="/register" className="font-medium text-white/80 transition hover:text-white">
                        Try registering again
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-white/80">6-Digit OTP</span>
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1A1A1A]/95 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition focus-within:border-white/20 focus-within:bg-[#202020]">
                            <span className="shrink-0 text-white/35">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="123456"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-transparent text-center text-lg font-bold tracking-[0.5em] text-white outline-none placeholder:text-white/25 placeholder:tracking-normal placeholder:font-normal"
                            />
                        </div>
                    </label>
                </div>

                {otp && !/^\d{6}$/.test(otp) ? (
                    <div className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                        OTP must be a 6-digit number.
                    </div>
                ) : null}

                {(error || successMessage) ? (
                    <div
                        className={`rounded-xl border px-4 py-3 text-sm ${error
                            ? 'border-rose-400/25 bg-rose-500/10 text-rose-100'
                            : 'border-emerald-400/25 bg-emerald-500/10 text-emerald-100'
                        }`}
                        role="status"
                        aria-live="polite"
                    >
                        {error || successMessage}
                    </div>
                ) : null}

                <button
                    type="submit"
                    disabled={loading || !/^\d{6}$/.test(otp)}
                    className="flex w-full items-center justify-center rounded-xl bg-white px-5 py-3.5 text-base font-medium text-black shadow-[0_10px_30px_rgba(255,255,255,0.14)] transition hover:translate-y-[-1px] hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                    {loading ? (
                        <span className="inline-flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                            Verifying...
                        </span>
                    ) : (
                        'Verify Email'
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};

export default VerifyEmail;
