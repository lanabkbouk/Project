// services/participations.js
//
// Matches the "participates" relation in the ERD (volunteer <-> opportunity).
// Returns the opportunities the currently logged-in volunteer has joined,
// each enriched with participation-specific fields (status, hours logged).
//
// TODO: once Laravel is ready, set VITE_USE_MOCK_PARTICIPATIONS=false
// GET /api/volunteers/me/participations
// Expected response: [{ opportunityId, status, hoursLogged, joinedDate, opportunity }, ...]

import { apiClient, getApiErrorMessage } from './api/client'
import { fetchOpportunities } from './opportunities'

const MOCK_MODE = (import.meta.env.VITE_USE_MOCK_PARTICIPATIONS || 'true') === 'true'

// Which opportunities (by id) the mock volunteer has joined, and their status.
const MOCK_PARTICIPATIONS = [
  { opportunityId: 'o3', status: 'completed', hoursLogged: 5, joinedDate: '2026-06-01' },
  { opportunityId: 'o1', status: 'ongoing', hoursLogged: 4, joinedDate: '2026-07-10' },
]

function wait(duration = 300) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

/**
 * Fetches the current volunteer's participations (joined opportunities).
 * @returns {Promise<Array<{opportunityId:string, status:string, hoursLogged:number, joinedDate:string, opportunity:object}>>}
 */
export async function fetchMyParticipations() {
  if (MOCK_MODE) {
    await wait()
    const opportunities = await fetchOpportunities()
    return MOCK_PARTICIPATIONS.map((participation) => ({
      ...participation,
      opportunity: opportunities.find((item) => item.id === participation.opportunityId) || null,
    })).filter((participation) => participation.opportunity)
  }

  try {
    const response = await apiClient.get('/volunteers/me/participations')
    return Array.isArray(response.data) ? response.data : response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load your volunteering history'))
  }
}