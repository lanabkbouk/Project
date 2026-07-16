import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LEGACY_REDIRECTS, ROUTES } from './constants/paths'
import { ACCOUNT_TYPES } from './constants/auth/accountTypes'
import ProtectedRoute from './app/routes/ProtectedRoute'
import MainLayout from './layouts/MainLayout'

import Home from './pages/home'
import About from './pages/about'
import Participates from './pages/participates'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VolunteerProfile from './pages/volunteerProfile'
import OrgProfile from './pages/orgProfile'

function ComingSoon({ title }) {
  return <div>{title} Page (Coming Soon)</div>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.PARTICIPATES} element={<Participates />} />
          <Route path={ROUTES.OPPORTUNITIES} element={<ComingSoon title='Opportunities' />} />
          <Route path={ROUTES.ORGANIZATIONS} element={<ComingSoon title='Organizations' />} />

          {/* Volunteer */}
          <Route element={<ProtectedRoute allowedAccountTypes={[ACCOUNT_TYPES.VOLUNTEER]} />}>
            <Route path={ROUTES.VOLUNTEER_PROFILE} element={<VolunteerProfile />} />
            <Route path={ROUTES.EXPLORE} element={<ComingSoon title='Explore' />} />
            <Route path={ROUTES.MY_VOLUNTEERING} element={<ComingSoon title='My Volunteering' />} />
          </Route>

          {/* Organization */}
          <Route element={<ProtectedRoute allowedAccountTypes={[ACCOUNT_TYPES.ORGANIZATION]} />}>
            <Route path={ROUTES.ORGANIZATION_PROFILE} element={<OrgProfile />} />
            <Route path={ROUTES.DASHBOARD} element={<ComingSoon title='Dashboard' />} />
            <Route path={ROUTES.MY_CAUSES} element={<ComingSoon title='My Causes' />} />
          </Route>
        </Route>

        {/* Auth */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        {/* Legacy redirects */}
        {LEGACY_REDIRECTS.map(({ from, to }) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}

        <Route path='*' element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
