export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <section className='min-h-screen bg-white px-4 py-10 text-black'>
      <div className='mx-auto flex min-h-[80vh] w-full max-w-xl items-center justify-center'>
        <div className='w-full rounded-2xl border border-white/10 bg-black p-6 text-white shadow-2xl sm:p-8'>
          <header className='mb-6'>
            <h1 className='text-center text-2xl font-bold'>{title}</h1>
            <p className='mt-2 text-center text-sm text-gray-400'>{subtitle}</p>
          </header>

          {children}

          {footer ? <footer className='mt-6 text-center text-sm text-gray-400'>{footer}</footer> : null}
        </div>
      </div>
    </section>
  )
}
