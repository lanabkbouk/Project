// services/opportunities.js
//
// Matches the "opportunity" table in the ERD:
// opp_id, title, description, status, start_date, end_date, location,
// min_hours, max_hours, total_hours, current_volu, max_volu
// + category (via "categorized"), skills (via "requires"),
// + organization (via "publishes").
//
// TODO: once Laravel is ready, set VITE_USE_MOCK_OPPORTUNITIES=false
// GET  /api/opportunities            -> list (supports ?search=&categoryId=&skillId=&location=)
// GET  /api/opportunities/{id}       -> single opportunity
// POST /api/opportunities/{id}/participate -> join an opportunity

import { apiClient, getApiErrorMessage } from './api/client'

const MOCK_MODE = (import.meta.env.VITE_USE_MOCK_OPPORTUNITIES || 'true') === 'true'

const MOCK_OPPORTUNITIES = [
  {
    id: 'o1',
    title: 'Clean Water for All',
    description:
      'Help install and maintain clean water access points for underserved communities. No prior experience required — training is provided on site.',
    status: 'open',
    startDate: '2026-08-05',
    endDate: '2026-08-20',
    location: 'Rotterdam, Netherlands',
    minHours: 2,
    maxHours: 6,
    totalHours: 120,
    currentVolunteers: 14,
    maxVolunteers: 30,
    category: { id: 'c1', name: 'Health' },
    skills: [{ id: 's1', name: 'First Aid' }, { id: 's7', name: 'Communication' }],
    organization: { id: 'org1', name: 'Blue Drop Foundation' },
    image: null,
  },
  {
    id: 'o2',
    title: 'After-School Tutoring Program',
    description:
      'Support local students with homework help and basic literacy skills, twice a week in the afternoon.',
    status: 'open',
    startDate: '2026-09-01',
    endDate: '2026-12-15',
    location: 'The Hague, Netherlands',
    minHours: 2,
    maxHours: 4,
    totalHours: 80,
    currentVolunteers: 9,
    maxVolunteers: 15,
    category: { id: 'c2', name: 'Education' },
    skills: [{ id: 's4', name: 'Teaching' }, { id: 's5', name: 'Tutoring' }],
    organization: { id: 'org2', name: 'Bright Minds NGO' },
    image: null,
  },
  {
    id: 'o3',
    title: 'Coastal Cleanup Day',
    description:
      'Join a one-day beach and coastal cleanup effort to protect local marine ecosystems.',
    status: 'open',
    startDate: '2026-08-12',
    endDate: '2026-08-12',
    location: 'Scheveningen Beach, NL',
    minHours: 3,
    maxHours: 5,
    totalHours: 40,
    currentVolunteers: 22,
    maxVolunteers: 40,
    category: { id: 'c5', name: 'Environment' },
    skills: [{ id: 's12', name: 'Environmental Awareness' }],
    organization: { id: 'org3', name: 'Green Coast Initiative' },
    image: null,
  },
  {
    id: 'o4',
    title: 'Community Food Bank Support',
    description:
      'Sort, pack, and distribute food donations to families in need across the city.',
    status: 'open',
    startDate: '2026-07-25',
    endDate: '2026-10-01',
    location: 'Rotterdam, Netherlands',
    minHours: 3,
    maxHours: 6,
    totalHours: 150,
    currentVolunteers: 30,
    maxVolunteers: 50,
    category: { id: 'c3', name: 'Social' },
    skills: [{ id: 's8', name: 'Event Management' }],
    organization: { id: 'org4', name: 'City Food Bank' },
    image: null,
  },
]

function wait(duration = 300) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

function matchesFilters(opportunity, filters = {}) {
  const { search = '', categoryId = '', skillId = '', location = '' } = filters

  const matchesSearch =
    !search || opportunity.title.toLowerCase().includes(search.trim().toLowerCase())

  const matchesCategory = !categoryId || opportunity.category?.id === categoryId

  const matchesSkill = !skillId || opportunity.skills.some((skill) => skill.id === skillId)

  const matchesLocation =
    !location || opportunity.location.toLowerCase().includes(location.trim().toLowerCase())

  return matchesSearch && matchesCategory && matchesSkill && matchesLocation
}

/**
 * Fetches opportunities, optionally filtered.
 * @param {{search?:string, categoryId?:string, skillId?:string, location?:string}} filters
 */
export async function fetchOpportunities(filters = {}) {
  if (MOCK_MODE) {
    await wait()
    return MOCK_OPPORTUNITIES.filter((opportunity) => matchesFilters(opportunity, filters))
  }

  try {
    const response = await apiClient.get('/opportunities', { params: filters })
    return Array.isArray(response.data) ? response.data : response.data?.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load opportunities'))
  }
}

/**
 * Fetches a single opportunity by id, along with a short list of similar
 * opportunities (same category, excluding itself) for the details sidebar.
 */
export async function fetchOpportunityById(id) {
  if (MOCK_MODE) {
    await wait()
    const opportunity = MOCK_OPPORTUNITIES.find((item) => item.id === id) || null
    const similar = opportunity
      ? MOCK_OPPORTUNITIES.filter(
          (item) => item.id !== id && item.category.id === opportunity.category.id,
        ).slice(0, 3)
      : []

    return { opportunity, similar }
  }

  try {
    const response = await apiClient.get(`/opportunities/${id}`)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load opportunity details'))
  }
}

/**
 * Registers the current volunteer's participation in an opportunity.
 * Maps to the "participates" relation (volunteer <-> opportunity).
 */
export async function participateInOpportunity(id) {
  if (MOCK_MODE) {
    await wait()
    return { success: true }
  }

  try {
    await apiClient.post(`/opportunities/${id}/participate`)
    return { success: true }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to join opportunity') }
  }
}