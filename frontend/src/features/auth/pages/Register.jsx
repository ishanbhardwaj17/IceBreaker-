import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const Field = ({ icon, placeholder, type = 'text', value, onChange, rightSlot }) => (
  <label className="block">
    <span className="sr-only">{placeholder}</span>
    <div className="flex items-center gap-3 rounded-2xl border border-[#69818D]/30 bg-[#0D1F23]/70 px-4 py-3.5 text-[#DCE6EB] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition focus-within:border-[#60B8FF]/70 focus-within:shadow-[0_0_0_4px_rgba(96,184,255,0.12)]">
      <span className="text-[#69818D]">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-sm outline-none placeholder:text-[#69818D]"
      />
      {rightSlot}
    </div>
  </label>
)

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { handleRegister, loading, error } = useAuth()

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const submitRegister = async (event) => {
    event.preventDefault()
    setSuccessMessage('')

    if (password !== confirmPassword) {
      return
    }

    try {
      const response = await handleRegister({ name: fullName, email, password })
      setSuccessMessage(response?.message || 'Registration successful. Check your inbox for the verification OTP.')
      setFullName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setShowPassword(false)
      setShowConfirm(false)
      navigate('/verify-email', {
        state: {
          userId: response?.userId,
          email: response?.email || email,
        },
      })
    } catch {
      // Redux stores the error message for inline display.
    }
  }

  return (
    <div
      className="relative flex h-dvh overflow-hidden bg-black text-white"
      style={{
        backgroundImage: "url('/bg1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <main className="relative mx-auto flex w-full items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <section className="w-full max-w-[380px] scale-[0.92] rounded-[2rem] border border-white/20 bg-white/10 p-7 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:scale-[0.94] sm:p-9">
          <div className="mb-7 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/45">OutreachAI</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Create Account</h1>
            <p className="mt-3 text-sm leading-6 text-white/65">Start generating personalized cold emails and LinkedIn DMs with AI.</p>
          </div>

          <form className="space-y-4" onSubmit={submitRegister}>
            <Field
              placeholder="Full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              icon={(
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7.5" r="4" />
                </svg>
              )}
            />

            <Field
              placeholder="Work email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              icon={(
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 6.5h16A1.5 1.5 0 0 1 21.5 8v8A1.5 1.5 0 0 1 20 17.5H4A1.5 1.5 0 0 1 2.5 16V8A1.5 1.5 0 0 1 4 6.5Z" />
                  <path d="m3.5 7.5 8.5 6 8.5-6" />
                </svg>
              )}
            />

            <Field
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              icon={(
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17 10V8a5 5 0 0 0-10 0v2" />
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M12 14v2" />
                </svg>
              )}
              rightSlot={(
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-full p-1 text-white/30 transition hover:text-white/60"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
                      <path d="M6.6 6.8C4.4 8.2 2.9 10 2 12c1.7 4 6 7 10 7 1.3 0 2.6-.2 3.8-.7" />
                      <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c4 0 8.3 3 10 7-.6 1.4-1.4 2.6-2.4 3.7" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              )}
            />

            <Field
              placeholder="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              icon={(
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17 10V8a5 5 0 0 0-10 0v2" />
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M12 14v2" />
                </svg>
              )}
              rightSlot={(
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  className="rounded-full p-1 text-white/30 transition hover:text-white/60"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? (
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
                      <path d="M6.6 6.8C4.4 8.2 2.9 10 2 12c1.7 4 6 7 10 7 1.3 0 2.6-.2 3.8-.7" />
                      <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c4 0 8.3 3 10 7-.6 1.4-1.4 2.6-2.4 3.7" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              )}
            />

            {password && confirmPassword && password !== confirmPassword ? (
              <div className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100" role="status" aria-live="polite">
                Passwords do not match.
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

            <p className="pt-1 text-xs leading-5 text-white/50">
              By signing up, you agree to our{' '}
              <a href="#" className="font-semibold text-white/75 hover:text-white">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="font-semibold text-white/75 hover:text-white">
                Privacy Policy
              </a>
              .
            </p>

            <button
              type="submit"
              disabled={loading || (password !== confirmPassword)}
              className="flex w-full items-center justify-center rounded-xl bg-white px-5 py-3.5 text-base font-medium text-black shadow-[0_10px_30px_rgba(255,255,255,0.14)] transition hover:translate-y-[-1px] hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  Creating account
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-center text-sm text-white/55">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-white/80 transition hover:text-white">
                Sign in
              </Link>
            </p>

            <div className="flex items-center gap-4 py-1 text-white/20">
              <span className="h-px flex-1 bg-white/15" />
              <span className="text-xs uppercase tracking-[0.35em] text-white/25">or</span>
              <span className="h-px flex-1 bg-white/15" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-black px-5 py-3.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
                <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.43-4.04-1.43-.54-1.38-1.33-1.74-1.33-1.74-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.91 0-1.31.46-2.38 1.22-3.22-.12-.3-.53-1.5.12-3.12 0 0 .99-.32 3.24 1.23a11.3 11.3 0 0 1 5.9 0c2.25-1.55 3.24-1.23 3.24-1.23.65 1.62.24 2.82.12 3.12.76.84 1.22 1.91 1.22 3.22 0 4.59-2.81 5.61-5.49 5.9.43.37.82 1.08.82 2.18v3.23c0 .32.21.69.83.58A12 12 0 0 0 12 .5Z" />
              </svg>
              Login with Github
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Register
