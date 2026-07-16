export function getUserDisplayName(user) {
  if (!user || typeof user !== 'object') return 'User'

  if (typeof user.name === 'string' && user.name.trim()) {
    return user.name.trim()
  }

  const fullName = [user.firstName, user.lastName]
    .filter((part) => typeof part === 'string' && part.trim())
    .join(' ')
    .trim()

  if (fullName) return fullName

  if (typeof user.orgName === 'string' && user.orgName.trim()) {
    return user.orgName.trim()
  }

  if (typeof user.email === 'string' && user.email.trim()) {
    return user.email.trim()
  }

  return 'User'
}
