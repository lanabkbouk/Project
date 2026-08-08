// services/organizations.js
//
// دليل المنظمات العام (Organizations Directory) — منفصل عمدًا عن
// services/organization.js (المفرد)، يلي مسؤول عن بروفايل *منظمتي أنا*
// (fetchOrganizationProfile / updateOrganizationProfile، محمي بمصادقة).
// هذا الملف بالمقابل مسؤول عن القائمة العامة والتفاصيل العامة لأي منظمة
// يتصفحها زائر/متطوع — نفس فرق opportunities.js عن services/opportunity.js
// لو كان موجود بالمشروع.
//
// ✅ تأكيد من فحص فعلي لكود الباك اند (OrganizationController + Resource):
// GET /api/organizations       -> قائمة، لكن مُصفّحة (paginate(15))، والرد
//                                  الفعلي جوا data.data مش data مباشرة.
//                                  ⚠️ الباك حاليًا لا يقرأ ?search= إطلاقًا
//                                  (index() بدون أي منطق فلترة) — الاستعلام
//                                  منرسله بأي حال تحسّبًا لما يُضاف مستقبلًا،
//                                  بس لا تتفاجئي لو ما فلتر فعليًا لسا.
// GET /api/organizations/{id}  -> منظمة واحدة، غير مُصفّحة.
//
// ⚠️ فروقات تسمية حقيقية بين الباك والفرونت (مؤكّدة من OrganizationResource):
//   contact_person  → contactPerson   (snake_case بالباك)
//   profile_image   → profileImageUrl (مسار كامل جاهز فعلاً، مش مجرد اسم ملف)
//   owner.email     → لا يوجد بروفايل منظمة "بريد" منفصل، بس owner متوفر لو احتجناه لاحقًا
//
// 🔴 فجوتان لا يمكن حلّهما من الفرونت (تحتاج الباك اند):
//   1) phone: موجود فعليًا بجدول users (عمود phone_number)، بس
//      OrganizationResource ما بيرجعه إطلاقًا. لحد ما يُضاف، بيرجع undefined دايمًا.
//   2) status: عمود "status" مش موجود إطلاقًا بجدول organizations —
//      بيرجع null دايمًا بغض النظر عن حالة التوثيق الفعلية. أي منطق
//      اعتماد على "موثّقة/غير موثّقة" هون معطّل مؤقتًا لحد ما الباك يضيف العمود.

import { apiClient, getApiErrorMessage } from './api/client'
import { isMockMode } from './api/mockMode'
import { wait } from './api/delay'
import { ORGANIZATION_STATUS } from '../constants/organizationStatus'

const MOCK_MODE = isMockMode()

// نفس المنظمات المرجعية المستخدمة أصلاً داخل MOCK_OPPORTUNITIES
// (org1..org4) حتى تبقى الفرص المعروضة بصفحة تفاصيل كل منظمة متسقة
// مع بيانات الفرص الفعلية.
// ⚠️ الدليل حاليًا يعرض كل المنظمات بغض النظر عن التوثيق (راجع TODO
// بـ fetchOrganizations تحت) — status هون VERIFIED بس لأنها بيانات mock،
// مش لأنه في فلترة فعلية عليها.
const MOCK_ORGANIZATIONS = [
  {
    id: 'org1',
    name: 'Blue Drop Foundation',
    description: 'Providing clean water access and hygiene education to underserved communities.',
    city: 'Rotterdam, Netherlands',
    phone: '+31611111111',
    website: 'https://bluedrop.example.org',
    contactPerson: 'Amina Youssef',
    profileImageUrl: null,
    status: ORGANIZATION_STATUS.VERIFIED,
  },
  {
    id: 'org2',
    name: 'Bright Minds NGO',
    description: 'After-school tutoring and literacy programs for local students.',
    city: 'The Hague, Netherlands',
    phone: '+31622222222',
    website: 'https://brightminds.example.org',
    contactPerson: 'Karim Haddad',
    profileImageUrl: null,
    status: ORGANIZATION_STATUS.VERIFIED,
  },
  {
    id: 'org3',
    name: 'Green Coast Initiative',
    description: 'Coastal and marine ecosystem cleanup and conservation projects.',
    city: 'Scheveningen, Netherlands',
    phone: '+31633333333',
    website: 'https://greencoast.example.org',
    contactPerson: 'Lina Farouk',
    profileImageUrl: null,
    status: ORGANIZATION_STATUS.VERIFIED,
  },
  {
    id: 'org4',
    name: 'City Food Bank',
    description: 'Fighting food insecurity through community food drives and distribution.',
    city: 'Amsterdam, Netherlands',
    phone: '+31644444444',
    website: 'https://cityfoodbank.example.org',
    contactPerson: 'Omar Al-Sayed',
    profileImageUrl: null,
    status: ORGANIZATION_STATUS.VERIFIED,
  },
]

/**
 * يحوّل استجابة OrganizationResource الخام (snake_case، owner متداخل)
 * لنفس شكل بيانات الـ mock تمامًا — نقطة واحدة، بدل ما كل Component
 * يعرف تفاصيل تسمية الباك اند.
 */
function mapOrganizationFromApi(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    name: raw.name || '',
    description: raw.description || '',
    city: raw.city || '',
    // 🔴 غير متوفر من الباك حاليًا (راجعي الملاحظة بأعلى الملف)
    phone: raw.phone || '',
    website: raw.website || '',
    contactPerson: raw.contact_person || '',
    profileImageUrl: raw.profile_image || null,
    // 🔴 دايمًا null حاليًا لحد ما الباك يضيف عمود status (راجعي الملاحظة بأعلى الملف)
    status: raw.status || ORGANIZATION_STATUS.PENDING,
  }
}

/**
 * يجلب قائمة المنظمات (فلترة الاسم/المدينة تصير هون بوضع الـ mock،
 * وبتنتقل لـ query param ?search= بوضع real). فلترة "الموثّقة فقط"
 * معطّلة مؤقتًا — راجع TODO تحت.
 * @param {{search?: string}} filters
 * @returns {Promise<Array<object>>}
 */
export async function fetchOrganizations({ search = '' } = {}) {
  if (MOCK_MODE) {
    await wait()

    // TODO: عمود status غير متوفر من الباك اند حاليًا — إعادة التفعيل
    // بعد إضافته لجدول organizations (راجع مع مطور الباك اند). فلترة
    // "الموثّقة فقط" هون كانت بتعتمد على org.status، يلي دايمًا null
    // بوضع real (راجع mapOrganizationFromApi تحت) — فلو طبّقنا نفس
    // الفلترة بوضع mock كمان، القائمة كانت رح تختلف بصمت بين الوضعين
    // (مليانة بmock، فاضية بreal) بدون أي رسالة توضّح السبب. لحد ما
    // الحقل يتوفر فعليًا، القائمة بتعرض كل المنظمات بغض النظر عن التوثيق.
    const normalizedSearch = search.trim().toLowerCase()
    if (!normalizedSearch) return MOCK_ORGANIZATIONS

    return MOCK_ORGANIZATIONS.filter(
      (organization) =>
        organization.name.toLowerCase().includes(normalizedSearch) ||
        organization.city.toLowerCase().includes(normalizedSearch),
    )
  }

  try {
    const response = await apiClient.get('/organizations', { params: { search } })
    // الباك اند بيرجّع النتيجة مُصفّحة (paginate) — بعد فك تغليف Laravel
    // بـ client.js، response.data بيصير { data: [...], links, meta }
    // مش array مباشرة، فلازم ندخل مستوى إضافي هون تحديدًا
    const list = Array.isArray(response.data) ? response.data : response.data?.data || []
    return list.map(mapOrganizationFromApi)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load organizations'), { cause: error })
  }
}

/**
 * يجلب منظمة واحدة بتفاصيلها الكاملة (لصفحة العرض العامة، ليس بروفايل "منظمتي").
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function fetchOrganizationById(id) {
  if (MOCK_MODE) {
    await wait()
    return MOCK_ORGANIZATIONS.find((organization) => organization.id === id) || null
  }

  try {
    const response = await apiClient.get(`/organizations/${id}`)
    return mapOrganizationFromApi(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load this organization'), { cause: error })
  }
}