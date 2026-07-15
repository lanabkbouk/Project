import { Outlet } from 'react-router-dom'
import Navbar from './navbar/Navbar'
import Footer from './Footer'
import { useSelector } from 'react-redux'
import { selectAccountType } from '../app/redux/authSekector'

export default function MainLayout() {

  const accountType = useSelector(selectAccountType) || 'guest'
  return (
    <div className='flex min-h-screen flex-col bg-slate-50 text-slate-900'>
      <Navbar role={accountType} />

      <main className='mx-auto w-full flex-1 max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

