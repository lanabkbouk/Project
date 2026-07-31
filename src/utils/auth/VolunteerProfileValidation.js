import { z } from 'zod'
import { calculateAge } from '../validators'


const GENDER_OPTIONS = ['Female', 'Male']

const EDUCATION_LEVEL_OPTIONS = [
  'No Formal Education',
  'High School',
  'Diploma',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
]

const SYRIA_GOVERNORATES = [
  'Damascus',
  'Rif Dimashq',
  'Aleppo',
  'Homs',
  'Hama',
  'Latakia',
  'Tartus',
  'Idlib',
  'Raqqa',
  'Deir ez-Zor',
  'Al-Hasakah',
  'Daraa',
  'As-Suwayda',
  'Quneitra',
]

export const profileSchema = z.object({
  educationLevel: z.enum(EDUCATION_LEVEL_OPTIONS, {
    errorMap: () => ({ message: 'Please select your education level' }),
  }),

  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => {
      const age = calculateAge(value)
      return age !== null && age >= 18
    }, 'You must be 18 years or older to register as a volunteer'),

  gender: z.enum(GENDER_OPTIONS, {
    errorMap: () => ({ message: 'Please select your gender' }),
  }),

  // كانت غير موجودة أصلًا بالـ schema رغم وجودها بالفورم — كان ممكن
  // تُحفظ فارغة بدون أي خطأ. هلق إجبارية متل باقي البروفايل.
  city: z.enum(SYRIA_GOVERNORATES, {
    errorMap: () => ({ message: 'Please select your governorate' }),
  }),

  // Array of skill IDs — at least one is required
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),

  // الوحيدان الاختياريان بالبروفايل بقرار صريح
  interests: z.string().optional(),
  about: z.string().optional(),
})

export function parseProfileForm(values) {
  return profileSchema.safeParse(values)
}