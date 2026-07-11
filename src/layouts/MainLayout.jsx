import { Outlet } from 'react-router-dom'
import MainNavbar from './navbar/MainNavbar'
import Footer from './Footer'

export default function MainLayout({ variant = 'guest' }) {
  return (
    <div className='flex min-h-screen flex-col bg-slate-50 text-slate-900'>
      <MainNavbar variant={variant} />
      <main className='mx-auto w-full flex-1 max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

