import { Outlet } from 'react-router-dom'
import Navbar from './navbar/Navbar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'

export default function MainLayout() {
  const { accountType } = useAuth()

  return (
    <div className='flex min-h-screen flex-col bg-slate-50 text-slate-900'>
      <Navbar role={accountType || 'guest'} />

      <main className='w-full flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
