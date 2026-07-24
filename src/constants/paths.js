export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PARTICIPATES: '/participates',
  VOLUNTEER_PROFILE: '/volunteer-profile',
  ORGANIZATION_PROFILE: '/organization-profile',
  LOGIN: '/login',
  REGISTER: '/register',
  EXPLORE: '/explore',
  MY_VOLUNTEERING: '/my-volunteering',
  DASHBOARD: '/dashboard',
  MY_CAUSES: '/my-causes',
  OPPORTUNITIES: '/opportunities',
  OPPORTUNITY_DETAILS: '/opportunities/:id',
  ORGANIZATIONS: '/organizations',
}

export const LEGACY_REDIRECTS = [
  { from: '/Login', to: ROUTES.LOGIN },
  { from: '/Register', to: ROUTES.REGISTER },
  { from: '/signUp', to: ROUTES.REGISTER },
  { from: '/volunteerProfile', to: ROUTES.VOLUNTEER_PROFILE },
  { from: '/orgProfile', to: ROUTES.ORGANIZATION_PROFILE },
]

export const AUTH_QUERY_KEYS = {
  TYPE: 'type',
} 