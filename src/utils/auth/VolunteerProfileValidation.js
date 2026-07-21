import { z } from 'zod'
import { calculateAge } from '../validators'


const GENDER_OPTIONS = ['Female', 'Male']

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
  educationLevel: z.string().optional(),

  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => {
      const age = calculateAge(value)
      return age !== null && age >= 18
    }, 'You must be 18 years or older to register as a volunteer'),

  gender: z
    .enum([...GENDER_OPTIONS, ''], {
      errorMap: () => ({ message: 'Please select your gender' }),
    })
    .optional(),  


  // Array of skill IDs — at least one is required
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),

  interests: z.string().optional(),
  about: z.string().optional(),
})

export function parseProfileForm(values) {
  return profileSchema.safeParse(values)
}