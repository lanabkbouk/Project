// حارس راوت (بنفس نمط ProtectedRoute): يلف حول كل الصفحات، ولو
// المستخدم متطوع وبروفايله لسا ناقص، يحوّله فورًا لصفحة البروفايل
// بغض النظر شو الصفحة يلي كان حاول يفتحها.
//
// ملاحظة: بيتجاهل أي مستخدم مو متطوع (زائر/منظمة) تمامًا، وما بيأثر
// على تسجيل الدخول/التسجيل لأنهم أصلاً برّا MainLayout بملف App.jsx.

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../../constants/paths'
import { useAuth } from '../../context/AuthContext'
import { ACCOUNT_TYPES } from '../../constants/auth/accountTypes'
import { isVolunteerProfileComplete } from '../../utils/auth/profileCompletion'

export default function RequireCompleteProfile() {
  const location = useLocation()
  const { isAuthenticated, accountType, user } = useAuth()

  const isVolunteer = isAuthenticated && accountType === ACCOUNT_TYPES.VOLUNTEER
  const profileIncomplete = isVolunteer && !isVolunteerProfileComplete(user)

  // نستثني صفحة البروفايل نفسها، وإلا المتطوع ما رح يقدر يوصلها أصلاً ليعبيها
  const isAlreadyOnProfilePage = location.pathname === ROUTES.VOLUNTEER_PROFILE

  if (profileIncomplete && !isAlreadyOnProfilePage) {
    return <Navigate to={ROUTES.VOLUNTEER_PROFILE} replace />
  }

  return <Outlet />
}