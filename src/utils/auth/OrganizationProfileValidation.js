// utils/auth/OrganizationProfileValidation.js
//
// تحقق فورم بروفايل المنظمة. لاحظي: "verification document" مش موجود
// هون قصدًا — هو حقل خاص بصفحة التسجيل فقط (مرة وحدة)، مو بالتعديل اللاحق.

import { z } from 'zod'

export const organizationProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name is required')
    .max(255, 'Organization name is too long'),

  description: z
    .string()
    .min(10, 'Please write at least a short description (10+ characters)'),

  city: z.string().min(1, 'Please select a governorate'),

  website: z
    .string()
    .url('Please enter a valid URL (e.g. https://example.org)')
    .optional()
    .or(z.literal('')),
})

export function parseOrganizationProfileForm(values) {
  return organizationProfileSchema.safeParse(values)
}