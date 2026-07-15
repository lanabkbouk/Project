import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from './constants/paths'
import { ACCOUNT_TYPES } from './constants/auth/accountTypes'
import ProtectedRoute from './app/routes/ProtectedRoute'

import Home from './pages/home'
import Login from './pages/auth/Login'
import Participates from './pages/participates'
import Register from './pages/auth/Register'
import VolunteerProfile from './pages/volunteerProfile'
import OrgProfile from './pages/orgProfile'
import About from './pages/about'
import MainLayout from './layouts/MainLayout'


function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>

          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.PARTICIPATES} element={<Participates />} />
          <Route path={ROUTES.OPPORTUNITIES} element={<div>Opportunities Page (Coming Soon)</div>} />
          <Route path={ROUTES.ORGANIZATIONS} element={<div>Organizations Page (Coming Soon)</div>} />

          {/* Volunteer Routes */}
          <Route element={<ProtectedRoute allowedAccountTypes={[ACCOUNT_TYPES.VOLUNTEER]} />}>
            <Route path={ROUTES.VOLUNTEER_PROFILE} element={<VolunteerProfile />} />
            <Route path={ROUTES.EXPLORE} element={<div>Explore Page (Coming Soon)</div>} />
            <Route path={ROUTES.MY_VOLUNTEERING} element={<div>My Volunteering Page (Coming Soon)</div>} />
          </Route>

          {/* Organization Routes */}
          <Route element={<ProtectedRoute allowedAccountTypes={[ACCOUNT_TYPES.ORGANIZATION]} />}>
            <Route path={ROUTES.ORGANIZATION_PROFILE} element={<OrgProfile />} />
            <Route path={ROUTES.DASHBOARD} element={<div>Dashboard Page (Coming Soon)</div>} />
            <Route path={ROUTES.MY_CAUSES} element={<div>My Causes Page (Coming Soon)</div>} />
          </Route>
        </Route>

        {/* Auth Routes - No Navbar */}

        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        <Route path='/Login' element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path='/Register' element={<Navigate to={ROUTES.REGISTER} replace />} />
        <Route path='/signUp' element={<Navigate to={ROUTES.REGISTER} replace />} />
        <Route path='/volunteerProfile' element={<Navigate to={ROUTES.VOLUNTEER_PROFILE} replace />} />
        <Route path='/orgProfile' element={<Navigate to={ROUTES.ORGANIZATION_PROFILE} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
