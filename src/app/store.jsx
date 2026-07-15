import { configureStore } from '@reduxjs/toolkit'
import authReducer from './redux/authSlice'
import volunteerReducer from './redux/volunteerSlice'
import organizationReducer from './redux/orgSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    volunteer: volunteerReducer,
    organization: organizationReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
})

export default store