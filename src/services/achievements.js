// services/achievements.js
//
// Per the ERD, the "achievement" table itself has exactly these columns:
//   achiev_id, name, description, date
// It belongs to one "volunteer" (the "earns" relation, volunteer 1 → N achievement).
//
// NOTE: achievements are NOT tied to a category (unlike opportunities and
// skills). These are general milestones — first opportunity, hours worked,
// group participation — that apply the same regardless of which category
// (Health, Education, Social...) the volunteer worked in.
//
// LOCKED / UNLOCKED ACHIEVEMENTS
// The volunteer profile shows the full achievement catalog (not just the
// ones already earned) so they can see what's still ahead of them — locked
// achievements are rendered in grayscale with their real name/description,
// unlocked ones show in full color with the date they were earned.
// This means the API must return EVERY achievement definition, each with:
//   - unlocked: boolean
//   - earnedDate: string | null  (null while locked)
//
// IMPORTANT — who grants an achievement:
// Awarding is entirely a backend business rule, not something an admin sets
// manually and not something decided in the frontend. The rules are:
//   - first completed opportunity
//   - 10 cumulative volunteering hours
//   - 3 completed group opportunities
// Laravel should evaluate these automatically (e.g. a model event/observer
// triggered when a participation is marked complete) and flip `unlocked` to
// true + set `earnedDate` once a rule is met. This file only displays
// whatever the API returns — nothing about which achievements exist, or
// whether they're unlocked, is hardcoded on the client.
//
// TODO: once the Laravel backend is ready, set VITE_USE_MOCK_ACHIEVEMENTS=false
// GET /api/volunteers/{volunteerId}/achievements
// Expected response: [{ id, name, description, unlocked, earnedDate }, ...]

import { apiClient, getApiErrorMessage } from './api/client'

const MOCK_MODE = (import.meta.env.VITE_USE_MOCK_ACHIEVEMENTS || 'true') === 'true'

const MOCK_ACHIEVEMENTS = [
  {
    id: 'a1',
    name: 'First Volunteering Opportunity',
    description: 'Completed your first volunteering opportunity.',
    unlocked: false,
    earnedDate: null,
  },
  {
    id: 'a2',
    name: '10 Volunteer Hours',
    description: 'Reached 10 cumulative volunteering hours.',
    unlocked: false,
    earnedDate: null,
  },
  {
    id: 'a3',
    name: 'Completion of Three Group Activities',
    description: 'Completed 3 group volunteering opportunities.',
    unlocked: false,
    earnedDate: null,
  },
]

function wait(duration = 300) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

/**
 * Fetches the FULL achievement catalog for a volunteer, each entry flagged
 * with whether it's unlocked yet (so locked ones can still be displayed).
 * @param {string|number} [volunteerId] - Volunteer id (optional when using token-based "me" auth)
 * @returns {Promise<Array<{id:string, name:string, description:string, unlocked:boolean, earnedDate:string|null}>>}
 */
export async function fetchVolunteerAchievements(volunteerId) {
  if (MOCK_MODE) {
    await wait()
    return MOCK_ACHIEVEMENTS
  }

  try {
    const endpoint = volunteerId
      ? `/volunteers/${volunteerId}/achievements`
      : '/volunteers/me/achievements'

    const response = await apiClient.get(endpoint)
    return Array.isArray(response.data) ? response.data : response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load achievements'))
  }
}