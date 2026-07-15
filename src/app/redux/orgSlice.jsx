
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
}

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganizationProfile: (state, action) => {
      state.profile = action.payload
    },
    clearOrganizationProfile: (state) => {
      state.profile = null
    },
  },
})

export const { setOrganizationProfile, clearOrganizationProfile } = organizationSlice.actions
export default organizationSlice.reducer