import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
}

const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState,
  reducers: {
    setVolunteerProfile: (state, action) => {
      state.profile = action.payload
    },
    clearVolunteerProfile: (state) => {
      state.profile = null
    },
  },
})

export const { setVolunteerProfile, clearVolunteerProfile } = volunteerSlice.actions
export default volunteerSlice.reducer