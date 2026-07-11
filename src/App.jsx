import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from './app/routes/paths'
import MainLayout from './layouts/MainLayout'
import Home from './pages/home'
import Login from './pages/auth/Login'
import Participates from './pages/participates'
import Register from './pages/auth/Register'
import VolunteerProfile from './pages/volunteerProfile'
import OrgProfile from './pages/orgProfile'
import About from './pages/about'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout variant='guest' />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.PARTICIPATES} element={<Participates />} />
          <Route path={ROUTES.VOLUNTEER_PROFILE} element={<VolunteerProfile />} />
          <Route path={ROUTES.ORGANIZATION_PROFILE} element={<OrgProfile />} />
        </Route>

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
