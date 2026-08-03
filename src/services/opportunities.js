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
import { getEffectiveOpportunityStatus, isVolunteerAgeEligible } from '../utils/opportunityStatus'
import { getCategoryIdsForSkillIds } from './skills'

const MOCK_MODE = isMockMode()

// يستبدل status المخزّنة بالحالة "الفعلية" المحسوبة لحظيًا (راجع
// utils/opportunityStatus.js) — بهيك أي Component بيقرأ opportunity.status
// بيشوف دايمًا القيمة الصحيحة (تسجيل مفتوح/منتهي/قيد العمل/منتهية) بدون
// أي تعديل إضافي على مكوّنات العرض نفسها
function attachComputedStatus(opportunity) {
  if (!opportunity) return opportunity
  return { ...opportunity, status: getEffectiveOpportunityStatus(opportunity) }
}

// مُعرّف حساب المنظمة الوهمي الوحيد المتاح حاليًا للتجربة — يُستخدم فقط
// لفلترة "My Causes" من نفس المصدر الموحّد أدناه (بدل جلبها من مصفوفة منفصلة)
const MOCK_MY_ORGANIZATION_ID = 'org-mock'

// مصدر بيانات وهمي واحد لكل الفرص — يحاكي جدول "opportunity" الحقيقي بالباك.
// أي فرصة تُنشئها منظمة (createOpportunity) تُضاف هنا مباشرة، فتظهر فورًا
// بصفحة تصفح الفرص العامة للمتطوعين، تمامًا كما ستتصرف مع Laravel لاحقًا.
// "My Causes" (fetchMyOpportunities) و"Opportunities" العامة (fetchOpportunities)
// كلاهما يقرأ من نفس المصفوفة، ويختلفان فقط بالفلترة المطبّقة.
// registrationClosedManually: علم داخلي بس (مش status) بيمثّل إغلاق
// التسجيل المبكر من طرف المنظمة — الحالة المعروضة فعليًا دايمًا محسوبة
// عبر attachComputedStatus/getEffectiveOpportunityStatus أدناه
let MOCK_OPPORTUNITIES = [
  {
    id: 'o1',
    title: 'Clean Water for All',
    description:
      'Help install and maintain clean water access points for underserved communities. No prior experience required — training is provided on site.',
    registrationClosedManually: false,
    startDate: '2026-08-05',
    endDate: '2026-08-20',
    location: 'Rotterdam, Netherlands',
    registerStartAt: '2026-07-15',
    registerEndAt: '2026-08-04',
    minHours: 2,
    maxHours: 6,
    totalHours: 120,
    currentVolunteers: 14,
    minVolunteers: 5,
    maxVolunteers: 30,
    minAge: 18,
    maxAge: 60,
    category: { id: 'c1', name: 'Health' },
    skills: [{ id: 's1', name: 'First Aid' }, { id: 's7', name: 'Communication' }],
    organization: { id: 'org1', name: 'Blue Drop Foundation', phone: '+31611111111', imageUrl: null },
    image: null,
  },
  {
    id: 'o2',
    title: 'After-School Tutoring Program',
    description:
      'Support local students with homework help and basic literacy skills, twice a week in the afternoon.',
    registrationClosedManually: false,
    startDate: '2026-09-01',
    endDate: '2026-12-15',
    location: 'The Hague, Netherlands',
    registerStartAt: '2026-07-10',
    registerEndAt: '2026-08-25',
    minHours: 2,
    maxHours: 4,
    totalHours: 80,
    currentVolunteers: 9,
    minVolunteers: 5,
    maxVolunteers: 15,
    minAge: 16,
    maxAge: 50,
    category: { id: 'c2', name: 'Education' },
    skills: [{ id: 's4', name: 'Teaching' }, { id: 's5', name: 'Tutoring' }],
    organization: { id: 'org2', name: 'Bright Minds NGO', phone: '+31622222222', imageUrl: null },
    image: null,
  },
  {
    id: 'o3',
    title: 'Coastal Cleanup Day',
    description:
      'Join a one-day beach and coastal cleanup effort to protect local marine ecosystems.',
    registrationClosedManually: false,
    startDate: '2026-08-12',
    endDate: '2026-08-12',
    location: 'Scheveningen Beach, NL',
    registerStartAt: '2026-07-20',
    registerEndAt: '2026-08-10',
    minHours: 3,
    maxHours: 5,
    totalHours: 40,
    currentVolunteers: 22,
    minVolunteers: 10,
    maxVolunteers: 40,
    minAge: 14,
    maxAge: null,
    category: { id: 'c5', name: 'Environment' },
    skills: [{ id: 's12', name: 'Environmental Awareness' }],
    organization: { id: 'org3', name: 'Green Coast Initiative', phone: '+31633333333', imageUrl: null },
    image: null,
  },
  {
    id: 'o4',
    title: 'Community Food Bank Support',
    description:
      'Sort, pack, and distribute food donations to families in need across the city.',
    registrationClosedManually: false,
    // تاريخ البدء ماضٍ فعليًا (قبل تاريخ اليوم) — تُعرض تلقائيًا كـ "قيد
    // العمل" (in_progress) بدون أي تدخل يدوي، مثال حي على الحساب التلقائي
    startDate: '2026-07-25',
    endDate: '2026-10-01',
    location: 'Rotterdam, Netherlands',
    registerStartAt: '2026-06-01',
    registerEndAt: '2026-07-20',
    minHours: 3,
    maxHours: 6,
    totalHours: 150,
    currentVolunteers: 30,
    minVolunteers: 15,
    maxVolunteers: 50,
    minAge: 18,
    maxAge: 65,
    category: { id: 'c3', name: 'Social' },
    skills: [{ id: 's8', name: 'Event Management' }],
    organization: { id: 'org4', name: 'City Food Bank', phone: '+31644444444', imageUrl: null },
    image: null,
  },
  {
    id: 'o5',
    title: 'Winter Clothes Drive',
    description:
      'Collected and distributed warm clothing to families ahead of the winter season.',
    registrationClosedManually: false,
    startDate: '2025-11-01',
    endDate: '2025-12-20',
    location: 'Rotterdam, Netherlands',
    registerStartAt: '2025-10-01',
    registerEndAt: '2025-10-25',
    minHours: 2,
    maxHours: 4,
    totalHours: 200,
    currentVolunteers: 25,
    minVolunteers: 10,
    maxVolunteers: 25,
    minAge: null,
    maxAge: null,
    category: { id: 'c3', name: 'Social' },
    skills: [{ id: 's8', name: 'Event Management' }],
    organization: { id: 'org4', name: 'City Food Bank', phone: '+31644444444', imageUrl: null },
    image: null,
  },
  {
    id: 'o6',
    title: 'Summer Reading Camp',
    description:
      'A two-week reading and literacy camp for children in underserved neighborhoods.',
    registrationClosedManually: false,
    startDate: '2025-07-01',
    endDate: '2025-07-14',
    location: 'The Hague, Netherlands',
    registerStartAt: '2025-05-01',
    registerEndAt: '2025-06-20',
    minHours: 3,
    maxHours: 5,
    totalHours: 180,
    currentVolunteers: 18,
    minVolunteers: 8,
    maxVolunteers: 18,
    minAge: 16,
    maxAge: 30,
    category: { id: 'c2', name: 'Education' },
    skills: [{ id: 's4', name: 'Teaching' }],
    organization: { id: 'org2', name: 'Bright Minds NGO', phone: '+31622222222', imageUrl: null },
    image: null,
  },
]

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
  const {
    search = '',
    categoryId = '',
    categoryIds = [],
    skillId = '',
    skillIds = [],
    location = '',
    age = null,
  } = filters

  const normalizedOpportunity = opportunity || {}
  const opportunityTitle = normalizedOpportunity.title || ''
  const opportunityLocation = normalizedOpportunity.location || ''
  const opportunityCategoryId = normalizedOpportunity.category?.id || ''
  const opportunitySkills = Array.isArray(normalizedOpportunity.skills)
    ? normalizedOpportunity.skills
    : []
  const normalizedCategoryIds = Array.isArray(categoryIds) ? categoryIds.filter(Boolean) : []
  const normalizedSkillIds = Array.isArray(skillIds) ? skillIds.filter(Boolean) : []

  const matchesSearch =
    !search || opportunityTitle.toLowerCase().includes(search.trim().toLowerCase())

  const matchesCategory =
    (!categoryId && normalizedCategoryIds.length === 0) ||
    opportunityCategoryId === categoryId ||
    normalizedCategoryIds.includes(opportunityCategoryId)

  const matchesSkill =
    (!skillId && normalizedSkillIds.length === 0) ||
    opportunitySkills.some((skill) => skill.id === skillId || normalizedSkillIds.includes(skill.id))

  const matchesLocation =
    !location || opportunityLocation.toLowerCase().includes(location.trim().toLowerCase())

  const matchesAge = age == null || isVolunteerAgeEligible(age, normalizedOpportunity)

  return matchesSearch && matchesCategory && matchesSkill && matchesLocation && matchesAge
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
    return MOCK_OPPORTUNITIES.map(attachComputedStatus).filter(
      (opportunity) => opportunity.status === OPPORTUNITY_STATUS.COMPLETED,
    )
  }

  try {
    const response = await apiClient.get('/opportunities', {
      params: { status: OPPORTUNITY_STATUS.COMPLETED },
    })
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
    return MOCK_OPPORTUNITIES.filter((opportunity) => matchesFilters(opportunity, filters)).map(
      attachComputedStatus,
    )
  }

  try {
    const response = await apiClient.get('/opportunities', { params: filters })
    return response.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load opportunities'))
  }
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
    const categoryIds = getCategoryIdsForSkillIds(skillIds)

    return MOCK_OPPORTUNITIES.filter((opportunity) => {
      // الفئة تُشتق من مهارات المتطوع المتاحة، وباقي المعايير تستخدم نفس
      // دالة المطابقة المشتركة حتى يظل السلوك موحّدًا بين التصفية والتوصية.
      return matchesFilters(opportunity, {
        skillIds,
        categoryIds,
        location: city,
        age,
      })
    }).map(attachComputedStatus)
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

    return {
      opportunity: attachComputedStatus(opportunity),
      similar: similar.map(attachComputedStatus),
    }
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
    ).map(attachComputedStatus)
  }

  try {
    const response = await apiClient.get('/organizations/me/opportunities')
    return response.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load your causes'))
  }
}

/**
 * يجلب الفرص المفتوحة الخاصة بمنظمة معيّنة (للعرض بصفحة تفاصيل تلك
 * المنظمة العامة) — يختلف عن fetchMyOpportunities لأنه يقبل أي
 * organizationId (مو بس صاحبة الجلسة الحالية).
 *
 * ⚠️ الباك اند الحقيقي ما عنده endpoint فرص مفعّل إطلاقًا لسا (راجع
 * OpportunityController — كل الدوال فاضية بدون أي implementation). لما
 * يجهز، رح يشتغل مباشرة عبر ?organization_id= بدون أي تعديل هون.
 */
export async function fetchOpportunitiesByOrganization(organizationId) {
  if (MOCK_MODE) {
    await wait()
    return MOCK_OPPORTUNITIES.map(attachComputedStatus).filter(
      (opportunity) =>
        opportunity.organization?.id === organizationId &&
        opportunity.status === OPPORTUNITY_STATUS.REGISTRATION_OPEN,
    )
  }

  try {
    const response = await apiClient.get('/opportunities', {
      params: { organization_id: organizationId, status: OPPORTUNITY_STATUS.REGISTRATION_OPEN },
    })
    return response.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load this organization\'s opportunities'), { cause: error })
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
      registrationClosedManually: false,
      currentVolunteers: 0,
      organization: { id: MOCK_MY_ORGANIZATION_ID, name: 'My Organization', phone: '+31600000000', imageUrl: null },
      image: imageFile ? URL.createObjectURL(imageFile) : null,
    }
    // تُضاف مباشرة لنفس المصدر الموحّد، فتظهر فورًا بصفحة التصفح العامة
    // للمتطوعين تمامًا كما ستظهر بـ "My Causes" — بلا أي فرق بينهما
    MOCK_OPPORTUNITIES.unshift(newOpportunity)
    return { success: true, data: attachComputedStatus(newOpportunity) }
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
    return { success: true, data: attachComputedStatus(MOCK_OPPORTUNITIES[index]) }
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
 * @param {string} id
 * @param {number} committedHours - أقل عدد ساعات حدّده المتطوع بنفسه
 *   وقت التسجيل، لازم يكون على الأقل minHours تبع هاي الفرصة بالذات
 *   (بدون سقف أعلى مفروض بهاي الخطوة)
 */
export async function participateInOpportunity(id, committedHours) {
  if (MOCK_MODE) {
    await wait()

    const opportunity = MOCK_OPPORTUNITIES.find((item) => item.id === id)
    if (!opportunity) return { success: false, error: 'Opportunity not found' }

    // ما منسمح بالانضمام إلا لما التسجيل فعليًا مفتوح (مو ممتلئة، ومو
    // متجاوزة نافذة التسجيل، ومو مغلقة يدويًا) — الحالة محسوبة تلقائيًا
    if (getEffectiveOpportunityStatus(opportunity) !== OPPORTUNITY_STATUS.REGISTRATION_OPEN) {
      return { success: false, error: 'Registration is no longer open for this opportunity' }
    }

    // تحقق من عدد الساعات — حقل "حد أدنى" بس (مو نطاق مغلق)، فبنتحقق إنه
    // على الأقل minHours تبع الفرصة بدون أي سقف أعلى نفرضه هون. نفس
    // القاعدة لازم تتأكد بالباك اند الحقيقي كمان (الفرونت خط دفاع أول بس)
    const hours = Number(committedHours)
    if (!Number.isFinite(hours) || hours < opportunity.minHours) {
      return {
        success: false,
        error: `Please commit to at least ${opportunity.minHours} hours.`,
      }
    }

    opportunity.currentVolunteers = (opportunity.currentVolunteers || 0) + 1

    return { success: true }
  }

  try {
    await apiClient.post(`/opportunities/${id}/participate`, { committed_hours: committedHours })
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

    // هالتبديل اليدوي مسموح بس بين "تسجيل مفتوح" و"تسجيل منتهي" (قبل ما
    // تبدأ الفرصة) — بنضبط علم registrationClosedManually فقط، والحالة
    // النهائية المعروضة بتنحسب دايمًا عبر attachComputedStatus
    MOCK_OPPORTUNITIES[index] = {
      ...MOCK_OPPORTUNITIES[index],
      registrationClosedManually: status === OPPORTUNITY_STATUS.REGISTRATION_CLOSED,
    }
    return { success: true, data: attachComputedStatus(MOCK_OPPORTUNITIES[index]) }
  }

  try {
    const response = await apiClient.patch(`/opportunities/${id}/status`, { status })
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to update cause status') }
  }
}