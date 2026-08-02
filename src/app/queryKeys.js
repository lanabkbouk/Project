// نقطة مركزية واحدة لكل مفاتيح React Query بالمشروع. بدل ما كل hook يكتب
// سلسلة نصية زي ['opportunities', 'list', filters] يدويًا (وباحتمال يغلط
// بحرف، أو ينسى مفتاح فرعي معرّف بمكان تاني)، كل المفاتيح معرّفة هون
// مرة وحدة كدوال، وأي hook أو صفحة تحتاج مفتاح تستورده من هون بس.
export const queryKeys = {
  categories: {
    all: ['categories'],
  },

  skills: {
    all: ['skills'],
  },

  stats: {
    platform: ['stats', 'platform'],
  },

  organization: {
    profile: (organizationId) => ['organization', 'profile', organizationId],
  },

  opportunities: {
    // المفتاح الجذر — تبطيله لحاله (invalidateQueries) بيشمل تلقائيًا
    // كل الفروع تحته (list/detail/mine/suggested/completed)، لأن React
    // Query بيطابق المفاتيح بالـ prefix
    all: ['opportunities'],
    list: (filters) => ['opportunities', 'list', filters],
    suggested: (params) => ['opportunities', 'suggested', params],
    detail: (id) => ['opportunities', 'detail', id],
    mine: (organizationId) => ['opportunities', 'mine', organizationId],
    completed: ['opportunities', 'completed'],
  },

  participations: {
    all: ['participations'],
    mine: ['participations', 'mine'],
    applicants: (opportunityId) => ['participations', 'applicants', opportunityId],
  },
}