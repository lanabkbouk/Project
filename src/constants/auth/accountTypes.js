export const ACCOUNT_TYPES = {
  VOLUNTEER: 'volunteer',
  ORGANIZATION: 'organization',
}

export function isAccountType(value) {
  return value === ACCOUNT_TYPES.VOLUNTEER || value === ACCOUNT_TYPES.ORGANIZATION
}
