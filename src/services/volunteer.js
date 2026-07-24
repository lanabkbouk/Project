// services/volunteer.js
//
// Handles saving the currently logged-in volunteer's own profile
// (personal info, skills, photo). Keeps the API call out of the page
// component, consistent with every other service in this project.
//
// TODO: once Laravel is ready, set VITE_USE_MOCK_VOLUNTEER_PROFILE=false
// POST /api/volunteers/me  (multipart/form-data, because of the photo)
// Expected response: { user: {...}, imageUrl: string }

import { apiClient, getApiErrorMessage } from './api/client'

const MOCK_MODE = (import.meta.env.VITE_USE_MOCK_VOLUNTEER_PROFILE || 'true') === 'true'

function wait(duration = 300) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

/**
 * Saves the volunteer's profile.
 * @param {FormData} formData - multipart payload (fields + optional image file)
 * @returns {Promise<{success: boolean, data?: {imageUrl?: string}, error?: string}>}
 */
export async function updateVolunteerProfile(formData) {
  if (MOCK_MODE) {
    await wait()
    // No real backend yet, so there is no uploaded file URL to return.
    // The page already shows the local image preview via FileReader,
    // so this is fine until Laravel is connected.
    return { success: true, data: { imageUrl: null } }
  }

  try {
    const response = await apiClient.post('/volunteers/me', formData, {
      // Let the browser set the multipart boundary itself — overriding
      // the default JSON Content-Type from apiClient would break the upload.
      headers: { 'Content-Type': undefined },
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to save profile') }
  }
}