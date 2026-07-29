// utils/opportunity/opportunityValidation.js
//
// تحقق فورم إنشاء/تعديل الفرصة. نفس أسماء الحقول المستخدمة بـ ERD
// (title, description, category, governorate/city, dates, hours, needed volunteers)

import { z } from 'zod'

export const opportunitySchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title is too long'),

    description: z
      .string()
      .min(20, 'Please write at least a short description (20+ characters)'),

    categoryId: z.string().min(1, 'Please select a category'),

    city: z.string().min(1, 'Please select a governorate'),

    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),

    minHours: z.coerce.number().min(1, 'Must be at least 1 hour'),
    maxHours: z.coerce.number().min(1, 'Must be at least 1 hour'),

    maxVolunteers: z.coerce
      .number()
      .int('Must be a whole number')
      .min(1, 'Must accept at least 1 volunteer'),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be on or after the start date',
    path: ['endDate'],
  })
  .refine((data) => data.maxHours >= data.minHours, {
    message: 'Max hours must be greater than or equal to min hours',
    path: ['maxHours'],
  })

export function parseOpportunityForm(values) {
  return opportunitySchema.safeParse(values)
}