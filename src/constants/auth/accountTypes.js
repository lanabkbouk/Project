export const ACCOUNT_TYPES = {
  VOLUNTEER: 'volunteer',
  ORGANIZATION: 'organization',
  // حساب المشرف — ما إله شاشة تسجيل عامة (زي volunteer/organization)،
  // بيوصل بس عبر دور مضبوط مسبقًا بالباك اند (Spatie Role)
  ADMIN: 'admin',
}

export function isAccountType(value) {
  return (
    value === ACCOUNT_TYPES.VOLUNTEER ||
    value === ACCOUNT_TYPES.ORGANIZATION ||
    value === ACCOUNT_TYPES.ADMIN
  )
}