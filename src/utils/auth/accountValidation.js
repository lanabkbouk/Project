import { z } from 'zod'
import { ACCOUNT_TYPES } from '../../constants/auth/accountTypes'

const requiredText = (message) => z.string().trim().min(1, message)
const requiredFile = (message) =>
  z.any().refine((value) => {
    if (typeof FileList !== 'undefined' && value instanceof FileList) {
      return value.length > 0
    }

    return Boolean(value)
  }, message)

const loginSchema = z.object({
  email: requiredText('Email is required').email('Invalid email address'),
  password: requiredText('Password is required'),
})

const registerBaseSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  orgName: z.string().optional(),
  contactPerson: z.string().optional(),
  email: requiredText('Email is required').email('Invalid email address'),
  phone: z.string().optional(),
  password: requiredText('Password is required').min(6, 'Password must be at least 6 characters'),
})

function getRegisterSchema(accountType) {
  if (accountType === ACCOUNT_TYPES.VOLUNTEER) {
    return registerBaseSchema
      .extend({
        firstName: requiredText('First name is required'),
        lastName: requiredText('Last name is required'),
      })
  }

  return registerBaseSchema
    .extend({
      orgName: requiredText('Organization name is required'),
      contactPerson: requiredText('Contact person is required'),
      phone: requiredText('Phone number is required for organizations'),
      verificationImage: requiredFile('Organization verification image is required'),
    })
}

export function parseLoginForm(values) {
  return loginSchema.safeParse(values)
}

export function parseRegisterForm(values, accountType) {
  return getRegisterSchema(accountType).safeParse(values)
}

export function mapZodErrors(error) {
  return error.issues.reduce((accumulator, issue) => {
    const field = issue.path[0]
    if (typeof field === 'string' && !accumulator[field]) {
      accumulator[field] = issue.message
    }

    return accumulator
  }, {})
}
