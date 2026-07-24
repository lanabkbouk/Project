// services/categories.js
//
// Matches the "category" table in the ERD: cat_id, name, description.
// This SAME category table is shared by three relations:
//   - opportunity  (via "categorized")
//   - skill        (via "has")
//   - achievement  (via "has")
// So these 6 categories are the single source of truth used everywhere
// (opportunities, skills, and achievements all reference one of them).
//
// "opportunitiesCount" is not a column on the table itself — it mirrors what
// a Laravel `withCount('opportunities')` relation would return, used only
// to render the counts next to each category in the sidebar.
//
// TODO: once Laravel is ready, set VITE_USE_MOCK_CATALOG=false
// GET /api/categories -> [{ id, name, description, opportunitiesCount }, ...]

import { apiClient, getApiErrorMessage } from './api/client'

const MOCK_MODE = (import.meta.env.VITE_USE_MOCK_CATALOG || 'true') === 'true'

const MOCK_CATEGORIES = [
  { id: 'c1', name: 'Health', description: 'Health awareness, care, and support programs', opportunitiesCount: 6 },
  { id: 'c2', name: 'Education', description: 'Tutoring, mentoring, and literacy programs', opportunitiesCount: 8 },
  { id: 'c3', name: 'Social', description: 'Community support and social welfare', opportunitiesCount: 5 },
  { id: 'c4', name: 'Sport', description: 'Sports events and youth activities', opportunitiesCount: 3 },
  { id: 'c5', name: 'Environment', description: 'Environmental cleanup and conservation', opportunitiesCount: 4 },
  { id: 'c6', name: 'Technical', description: 'IT, design, and technical support projects', opportunitiesCount: 4 },
]

function wait(duration = 250) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

/**
 * Fetches all categories (shared across opportunities, skills, and achievements).
 * @returns {Promise<Array<{id:string, name:string, description:string, opportunitiesCount:number}>>}
 */
export async function fetchCategories() {
  if (MOCK_MODE) {
    await wait()
    return MOCK_CATEGORIES
  }

  try {
    const response = await apiClient.get('/categories')
    return Array.isArray(response.data) ? response.data : response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load categories'))
  }
}