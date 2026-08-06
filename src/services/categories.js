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
// TODO: once Laravel is ready, set VITE_API_MODE=real
// GET /api/categories -> [{ id, name, description, opportunitiesCount }, ...]

import { apiClient, getApiErrorMessage } from './api/client'
import { isMockMode } from './api/mockMode'
import { wait } from './api/delay'

const MOCK_MODE = isMockMode()

const MOCK_CATEGORIES = [
  { id: 'c1', name: 'Health', description: 'Health awareness, care, and support programs', opportunitiesCount: 6 },
  { id: 'c2', name: 'Education', description: 'Tutoring, mentoring, and literacy programs', opportunitiesCount: 8 },
  { id: 'c3', name: 'Social', description: 'Community support and social welfare', opportunitiesCount: 5 },
  { id: 'c4', name: 'Sport', description: 'Sports events and youth activities', opportunitiesCount: 3 },
  { id: 'c5', name: 'Environment', description: 'Environmental cleanup and conservation', opportunitiesCount: 4 },
  { id: 'c6', name: 'Technical', description: 'IT, design, and technical support projects', opportunitiesCount: 4 },
]

/**
 * Fetches all categories (shared across opportunities, skills, and achievements).
 * @returns {Promise<Array<{id:string, name:string, description:string, opportunitiesCount:number}>>}
 */
export async function fetchCategories() {
  if (MOCK_MODE) {
    await wait()
    // ⚠️ نسخة جديدة، مش المرجع الحي لـ MOCK_CATEGORIES — وإلا React
    // Query بتخزّن نفس المصفوفة بالكاش، وأي push لاحق (زي createCategory
    // تحت) بينعكس عليها مباشرة بصمت دون علم React Query، وبعدين
    // onSuccess بيضيف العنصر يدويًا *مرة ثانية* فوق نفس المصفوفة
    // المتغيّرة أصلًا → العنصر يظهر مكرَّرًا (بطاقتين لنفس الفئة الجديدة)
    return [...MOCK_CATEGORIES]
  }

  try {
    const response = await apiClient.get('/categories')
    return response.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load categories'))
  }
}

// ————————————————————————————————————————————————————————————
// إدارة التصنيفات (أدمن فقط) — الباك اند الحقيقي جاهز بالكامل لهذا
// الجزء فعليًا (CategoryController فيه store/update/destroy مكتملة،
// راجع الـ routes تحت auth:sanctum). الحقول تطابق CategoryRequest
// بالضبط: name (فريد)، description.
// ————————————————————————————————————————————————————————————

/**
 * ينشئ تصنيفًا جديدًا. نفس نمط {success,data/error} المستخدم بباقي
 * عمليات التعديل (organization.js، participations.js) لأنه فشل واحد
 * (مثلًا اسم مكرر) ما لازم يكسر الصفحة، فقط يُعرض كرسالة خطأ واضحة.
 * @param {{name: string, description: string}} payload
 */
export async function createCategory(payload) {
  if (MOCK_MODE) {
    await wait()

    const nameTaken = MOCK_CATEGORIES.some(
      (category) => category.name.trim().toLowerCase() === payload.name.trim().toLowerCase(),
    )
    if (nameTaken) return { success: false, error: 'A category with this name already exists' }

    const newCategory = {
      id: `c${Date.now()}`,
      name: payload.name,
      description: payload.description,
      opportunitiesCount: 0,
    }
    MOCK_CATEGORIES.push(newCategory)
    return { success: true, data: newCategory }
  }

  try {
    const response = await apiClient.post('/categories', payload)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to create category') }
  }
}

/**
 * يعدّل بيانات تصنيف موجود (الاسم والوصف فقط).
 * @param {string|number} categoryId
 * @param {{name: string, description: string}} payload
 */
export async function updateCategory(categoryId, payload) {
  if (MOCK_MODE) {
    await wait()

    const category = MOCK_CATEGORIES.find((item) => item.id === categoryId)
    if (!category) return { success: false, error: 'Category not found' }

    // نستثني التصنيف نفسه من فحص التكرار — نفس منطق updateSkill بالضبط
    const nameTaken = MOCK_CATEGORIES.some(
      (item) =>
        item.id !== categoryId && item.name.trim().toLowerCase() === payload.name.trim().toLowerCase(),
    )
    if (nameTaken) return { success: false, error: 'A category with this name already exists' }

    category.name = payload.name
    category.description = payload.description
    return { success: true, data: category }
  }

  try {
    const response = await apiClient.put(`/categories/${categoryId}`, payload)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to update category') }
  }
}

/**
 * يحذف تصنيفًا. ⚠️ الحذف هون نهائي وما إلو Undo — الصفحة بتسأل
 * تأكيد قبل ما تستدعي هالدالة (راجع AdminCatalogManagement.jsx).
 * @param {string|number} categoryId
 */
export async function deleteCategory(categoryId) {
  if (MOCK_MODE) {
    await wait()

    const index = MOCK_CATEGORIES.findIndex((item) => item.id === categoryId)
    if (index === -1) return { success: false, error: 'Category not found' }

    MOCK_CATEGORIES.splice(index, 1)
    return { success: true }
  }

  try {
    await apiClient.delete(`/categories/${categoryId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to delete category') }
  }
}