// services/volunteer.js
//
// Handles saving the currently logged-in volunteer's own profile
// (personal info, skills, photo). Keeps the API call out of the page
// component, consistent with every other service in this project.
//
// POST /api/volunteers/me  (multipart/form-data, because of the photo)
// Laravel requires POST + _method: PUT for file uploads in updates.

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
    return { success: true, data: { imageUrl: null } }
  }

  try {
    // IMPORTANT:
    // PHP does NOT read files in PUT multipart/form-data.
    // So we send POST + _method: PUT to allow Laravel to process the file.
    formData.append('_method', 'PUT')

    const response = await apiClient.post('/volunteers/me', formData, {
      headers: { 'Content-Type': undefined }, // allow browser to set boundary
    })

    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to save profile') }
  }
}
