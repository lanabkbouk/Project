// services/opportunities.js
//
// Matches the "opportunity" table in the ERD:
// opp_id, title, description, status, start_date, end_date, location,
// min_hours, max_hours, total_hours, current_volu, max_volu
// + category (via "categorized"), skills (via "requires"),
// + organization (via "publishes").
//
// TODO: once Laravel is ready, set VITE_API_MODE=real
// GET  /api/opportunities            -> list (supports ?search=&categoryId=&skillId=&location=)
// GET  /api/opportunities/{id}       -> single opportunity
// POST /api/opportunities/{id}/participate -> join an opportunity

import { apiClient, getApiErrorMessage } from './api/client'
import { isMockMode } from './api/mockMode'
import { wait } from './api/delay'
import { OPPORTUNITY_STATUS } from '../constants/opportunityStatus'

const MOCK_MODE = isMockMode()

// مُعرّف حساب المنظمة الوهمي الوحيد المتاح حاليًا للتجربة — يُستخدم فقط
// لفلترة "My Causes" من نفس المصدر الموحّد أدناه (بدل جلبها من مصفوفة منفصلة)
const MOCK_MY_ORGANIZATION_ID = 'org-mock'

// مصدر بيانات وهمي واحد لكل الفرص — يحاكي جدول "opportunity" الحقيقي بالباك.
// أي فرصة تُنشئها منظمة (createOpportunity) تُضاف هنا مباشرة، فتظهر فورًا
// بصفحة تصفح الفرص العامة للمتطوعين، تمامًا كما ستتصرف مع Laravel لاحقًا.
// "My Causes" (fetchMyOpportunities) و"Opportunities" العامة (fetchOpportunities)
// كلاهما يقرأ من نفس المصفوفة، ويختلفان فقط بالفلترة المطبّقة.
let MOCK_OPPORTUNITIES = [
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
    organization: { id: 'org1', name: 'Blue Drop Foundation', imageUrl: null },
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
    organization: { id: 'org2', name: 'Bright Minds NGO', imageUrl: null },
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
    organization: { id: 'org3', name: 'Green Coast Initiative', imageUrl: null },
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
    organization: { id: 'org4', name: 'City Food Bank', imageUrl: null },
    image: null,
  },
  {
    id: 'o5',
    title: 'Winter Clothes Drive',
    description:
      'Collected and distributed warm clothing to families ahead of the winter season.',
    status: 'closed',
    startDate: '2025-11-01',
    endDate: '2025-12-20',
    location: 'Rotterdam, Netherlands',
    minHours: 2,
    maxHours: 4,
    totalHours: 200,
    currentVolunteers: 25,
    maxVolunteers: 25,
    category: { id: 'c3', name: 'Social' },
    skills: [{ id: 's8', name: 'Event Management' }],
    organization: { id: 'org4', name: 'City Food Bank', imageUrl: null },
    image: null,
  },
  {
    id: 'o6',
    title: 'Summer Reading Camp',
    description:
      'A two-week reading and literacy camp for children in underserved neighborhoods.',
    status: 'closed',
    startDate: '2025-07-01',
    endDate: '2025-07-14',
    location: 'The Hague, Netherlands',
    minHours: 3,
    maxHours: 5,
    totalHours: 180,
    currentVolunteers: 18,
    maxVolunteers: 18,
    category: { id: 'c2', name: 'Education' },
    skills: [{ id: 's4', name: 'Teaching' }],
    organization: { id: 'org2', name: 'Bright Minds NGO', imageUrl: null },
    image: null,
  },
]

// تتحقق إذا وصل عدد المتطوعين الحاليين للحد الأقصى — تُستخدم لتفعيل
// الإغلاق التلقائي فور انضمام آخر متطوع، بمعزل عن أي إغلاق يدوي من المنظمة
function isOpportunityFull(currentVolunteers, maxVolunteers) {
  return maxVolunteers != null && currentVolunteers >= maxVolunteers
}

// يبني FormData لطلب إنشاء/تعديل فرصة، مع إرفاق الصورة إن وُجدت
function buildOpportunityFormData(payload, imageFile) {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value)
  })

  if (imageFile) formData.append('image', imageFile)

  return formData
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
 * يجلب الفرص المكتملة بنجاح فقط (وصلت للعدد الكامل من المتطوعين
 * وانتهت فعليًا) — تُستخدم بسكشن "Success Stories" بالصفحة الرئيسية.
 *
 * TODO: لما يجهز endpoint الباك، ممكن يصير فلتر status=closed مباشرة
 * من السيرفر بدل الفلترة هون، بدون ما تتغيّر واجهة الدالة.
 */
export async function fetchCompletedOpportunities() {
  if (MOCK_MODE) {
    await wait()
    return MOCK_OPPORTUNITIES.filter((opportunity) => opportunity.status === 'closed')
  }

  try {
    const response = await apiClient.get('/opportunities', { params: { status: 'closed' } })
    return response.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load completed opportunities'))
  }
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
    return response.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load opportunities'))
  }
}

// يتحقق إذا كان عمر المتطوع ضمن نطاق [minAge, maxAge] تبع الفرصة —
// معلّق التفعيل حاليًا: الفرصة ما فيها minAge/maxAge لسا (بانتظار
// موافقة المشرفة على الفكرة أصلًا)، فهاي الدالة برجع true دايمًا هلق
// ولا تأثير فعلي إلها. لما توافق المشرفة ونضيف الحقلين لبيانات الفرصة،
// بتشتغل تلقائيًا بدون أي تعديل إضافي هون.
function isWithinAgeRange(volunteerAge, opportunity) {
  if (volunteerAge == null) return true
  if (!opportunity.minAge || !opportunity.maxAge) return true
  return volunteerAge >= opportunity.minAge && volunteerAge <= opportunity.maxAge
}

/**
 * يجلب الفرص المصنّفة "مناسبة" للمتطوع الحالي حسب الخوارزمية — بناءً
 * على معلومات بروفايله الثابتة (مهاراته ومدينته حاليًا) فقط، مو فلترة
 * يدوية أو تصنيف بشري.
 *
 * قرار مؤكد: الخوارزمية تعتمد فقط على بيانات البروفايل الموجودة أصلًا
 * (سنا أكدت هيك) — ما في تتبع سلوك أو تفاعل (زي عدد فتحات فرصة معينة
 * أو الفئات الأكثر تصفحًا)، فما في داعي نضيف أي كود لإرسال أحداث
 * تفاعل من الفرونت مستقبلًا.
 *
 * TODO: لما يجهز endpoint الباك الحقيقي (اقتراح الفرص عبر الخوارزمية)،
 * نستبدل منطق الـ MOCK هون بس، بدون ما نلمس أي Component يستخدمها.
 * شكل الـ Response النهائي (وهل فيه matching score) لسا بانتظار تأكيد الباك.
 *
 * @param {{skillIds?: string[], age?: number|null, city?: string}} volunteer
 */
export async function fetchSuggestedOpportunities({ skillIds = [], age = null, city = '' } = {}) {
  if (MOCK_MODE) {
    await wait()
    return MOCK_OPPORTUNITIES.filter((opportunity) => {
      const matchesAge = isWithinAgeRange(age, opportunity)
      const matchesSkill =
        skillIds.length === 0 || opportunity.skills.some((skill) => skillIds.includes(skill.id))
      const matchesCity = !city || opportunity.location.toLowerCase().includes(city.toLowerCase())

      // نطاق العمر شرط أساسي (لأسباب تتعلق بمناسبة الفرصة فعليًا)، أما
      // تطابق المهارة أو المدينة فيكفي واحد منهم ليُعتبر "مناسب"
      return matchesAge && (matchesSkill || matchesCity)
    })
  }

  try {
    const response = await apiClient.get('/volunteers/me/suggested-opportunities')
    return response.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load suggested opportunities'))
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
          (item) => item.id !== id && item.category?.id === opportunity.category?.id,
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
 * يجلب الفرص الخاصة بالمنظمة المسجّلة دخولها حاليًا (لصفحة "My Causes").
 * ملاحظة Mock: نرجع كل قائمة الفرص التجريبية كأنها فرص نفس المنظمة، بما إنه
 * حساب Mock واحد بس متاح للتجربة حاليًا — سيُستبدل بفلترة حقيقية حسب
 * organization_id لما يجهز GET /organizations/me/opportunities.
 */
export async function fetchMyOpportunities() {
  if (MOCK_MODE) {
    await wait()
    return MOCK_OPPORTUNITIES.filter(
      (opportunity) => opportunity.organization?.id === MOCK_MY_ORGANIZATION_ID,
    )
  }

  try {
    const response = await apiClient.get('/organizations/me/opportunities')
    return response.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load your causes'))
  }
}

/**
 * يحذف فرصة تنشرها المنظمة (بعد تأكيد المستخدم).
 */
export async function deleteOpportunity(id) {
  if (MOCK_MODE) {
    await wait()
    MOCK_OPPORTUNITIES = MOCK_OPPORTUNITIES.filter((item) => item.id !== id)
    return { success: true }
  }

  try {
    await apiClient.delete(`/opportunities/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to delete this cause') }
  }
}
/**
 * ينشئ فرصة جديدة (من طرف المنظمة).
 */
export async function createOpportunity({ imageFile, ...payload }) {
  if (MOCK_MODE) {
    await wait()
    const newOpportunity = {
      ...payload,
      id: `o${Date.now()}`,
      status: OPPORTUNITY_STATUS.OPEN,
      currentVolunteers: 0,
      organization: { id: MOCK_MY_ORGANIZATION_ID, name: 'My Organization', imageUrl: null },
      image: imageFile ? URL.createObjectURL(imageFile) : null,
    }
    // تُضاف مباشرة لنفس المصدر الموحّد، فتظهر فورًا بصفحة التصفح العامة
    // للمتطوعين تمامًا كما ستظهر بـ "My Causes" — بلا أي فرق بينهما
    MOCK_OPPORTUNITIES.unshift(newOpportunity)
    return { success: true, data: newOpportunity }
  }

  try {
    const formData = buildOpportunityFormData(payload, imageFile)
    const response = await apiClient.post('/opportunities', formData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to create this cause') }
  }
}

/**
 * يعدّل فرصة موجودة (من طرف المنظمة).
 */
export async function updateOpportunity(id, { imageFile, ...payload }) {
  if (MOCK_MODE) {
    await wait()
    const index = MOCK_OPPORTUNITIES.findIndex((item) => item.id === id)
    if (index !== -1) {
      MOCK_OPPORTUNITIES[index] = {
        ...MOCK_OPPORTUNITIES[index],
        ...payload,
        image: imageFile ? URL.createObjectURL(imageFile) : MOCK_OPPORTUNITIES[index].image,
      }
    }
    return { success: true, data: MOCK_OPPORTUNITIES[index] }
  }

  try {
    const formData = buildOpportunityFormData(payload, imageFile)
    formData.append('_method', 'PUT')
    const response = await apiClient.post(`/opportunities/${id}`, formData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to update this cause') }
  }
}

/**
 * Registers the current volunteer's participation in an opportunity.
 * Maps to the "participates" relation (volunteer <-> opportunity).
 */
export async function participateInOpportunity(id) {
  if (MOCK_MODE) {
    await wait()

    const opportunity = MOCK_OPPORTUNITIES.find((item) => item.id === id)
    if (!opportunity) return { success: false, error: 'Opportunity not found' }

    opportunity.currentVolunteers = (opportunity.currentVolunteers || 0) + 1

    // إغلاق تلقائي فور اكتمال العدد — لا علاقة له بالإغلاق اليدوي أدناه
    if (isOpportunityFull(opportunity.currentVolunteers, opportunity.maxVolunteers)) {
      opportunity.status = OPPORTUNITY_STATUS.CLOSED
    }

    return { success: true }
  }

  try {
    await apiClient.post(`/opportunities/${id}/participate`)
    return { success: true }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to join opportunity') }
  }
}

/**
 * تبديل حالة الفرصة يدويًا (إغلاق/إعادة فتح) من طرف المنظمة —
 * منفصل تمامًا عن الإغلاق التلقائي أعلاه: يعمل بغض النظر عن نسبة الامتلاء.
 * مثال استخدام: إغلاق فرصة مبكرًا رغم عدم اكتمال العدد، أو إعادة فتحها
 * لاحقًا لو انسحب بعض المتطوعين.
 */
export async function setOpportunityStatus(id, status) {
  if (MOCK_MODE) {
    await wait()
    const index = MOCK_OPPORTUNITIES.findIndex((item) => item.id === id)
    if (index === -1) return { success: false, error: 'Opportunity not found' }

    MOCK_OPPORTUNITIES[index] = { ...MOCK_OPPORTUNITIES[index], status }
    return { success: true, data: MOCK_OPPORTUNITIES[index] }
  }

  try {
    const response = await apiClient.patch(`/opportunities/${id}/status`, { status })
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to update cause status') }
  }
}