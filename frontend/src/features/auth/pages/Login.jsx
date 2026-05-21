import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const Field = ({ icon, type = 'text', placeholder, value, onChange, rightSlot }) => {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-white/80">{placeholder}</span>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1A1A1A]/95 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition focus-within:border-white/20 focus-within:bg-[#202020]">
        <span className="shrink-0 text-white/35">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
        />
        {rightSlot}
      </div>
    </label>
  )
}

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const { handleLogin, loading, error } = useAuth()

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const submitLogin = async (event) => {
    event.preventDefault()
    setSuccessMessage('')

    try {
      await handleLogin({ email, password })
      setSuccessMessage('Login successful. Redirecting...')
      navigate('/dashboard')
    } catch {
      // Inline error is handled from Redux state.
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
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Login</h1>
            <p className="mt-3 text-sm leading-6 text-white/65">Sign in to continue to your workspace.</p>
          </div>

          <form className="space-y-4" onSubmit={submitLogin}>
            <Field
              placeholder="Your Email"
              
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
              placeholder="Your password"
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

            <div className="flex items-center justify-between gap-3 pt-1">
              <a href="#" className="text-sm font-medium text-white/75 transition hover:text-white">
                Forgot Password?
              </a>
            </div>

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
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-white px-5 py-3.5 text-base font-medium text-black shadow-[0_10px_30px_rgba(255,255,255,0.14)] transition hover:translate-y-[-1px] hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  Logging in
                </span>
              ) : (
                'Login'
              )}
            </button>

            <p className="text-center text-sm text-white/55">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-white/80 transition hover:text-white">
                Sign up
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

export default Login
