const AuthLayout = ({ eyebrow, title, subtitle, children, footer }) => {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black text-white"
      style={{
        backgroundImage: "url('/bg1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 backdrop-blur">
              OutreachAI
            </div>
            <p className="text-sm font-medium tracking-[0.25em] text-white/55 uppercase">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">{title}</h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/70 sm:text-base">{subtitle}</p>
          </div>

          <div className="rounded-[2rem] border border-white/20 bg-black/35 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-8">
            <div className="relative rounded-[1.6rem] border border-white/10 bg-black/25 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6">
              {children}
            </div>
          </div>

          {footer ? <div className="mt-6 text-center text-sm text-white/70">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout