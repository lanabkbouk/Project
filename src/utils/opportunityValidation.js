// تحقق فورم إنشاء/تعديل الفرصة. نفس أسماء الحقول المستخدمة بـ ERD
// (title, description, category, governorate/city, dates, hours,
// needed volunteers, register window, skills)
// ⚠️ حقل نطاق العمر (minAge/maxAge) أُزيل بالكامل بناءً على طلب فريق
// الباك اند — التصنيف ما عاد فيه أي قيد عمري إطلاقًا.

import { z } from 'zod'

export const opportunitySchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required.')
      .min(3, 'Title must be at least 3 characters.')
      .max(255, 'Title must not exceed 255 characters.'),

    description: z
      .string()
      .min(1, 'Description is required.')
      .min(20, 'Description must be at least 20 characters.'),

    categoryId: z.string().min(1, 'Please select a category.'),

    city: z.string().min(1, 'Please select a governorate.'),

    // مهارات مطلوبة على الأقل واحدة — تُستخدم بخوارزمية اقتراح الفرص
    // للمتطوعين (حسب المهارات والمدينة)
    skills: z.array(z.string()).min(1, 'Please select at least one required skill.'),

    startDate: z.string().min(1, 'Start date is required.'),
    endDate: z.string().min(1, 'End date is required.'),

    // نافذة التسجيل: من متى لمتى يقدر المتطوع يسجّل بالفرصة
    registerStartAt: z.string().min(1, 'Registration start date is required.'),
    registerEndAt: z.string().min(1, 'Registration end date is required.'),

    minHours: z.coerce.number().min(1, 'Minimum hours must be at least 1.'),
    maxHours: z.coerce.number().min(1, 'Maximum hours must be at least 1.'),

    totalHours: z.coerce.number().min(1, 'Total hours must be at least 1.'),

    minVolunteers: z.coerce
      .number()
      .int('Minimum volunteers must be a whole number.')
      .min(1, 'At least 1 volunteer is required.'),

    maxVolunteers: z.coerce
      .number()
      .int('Volunteers needed must be a whole number.')
      .min(1, 'At least 1 volunteer is required.'),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be on or after the start date.',
    path: ['endDate'],
  })
  .refine((data) => data.maxHours >= data.minHours, {
    message: 'Maximum hours must be greater than or equal to minimum hours.',
    path: ['maxHours'],
  })
  .refine((data) => data.maxVolunteers >= data.minVolunteers, {
    message: 'Maximum volunteers must be greater than or equal to minimum volunteers.',
    path: ['maxVolunteers'],
  })
  .refine((data) => new Date(data.registerEndAt) >= new Date(data.registerStartAt), {
    message: 'Registration end date must be on or after the registration start date.',
    path: ['registerEndAt'],
  })
  .refine((data) => new Date(data.registerEndAt) <= new Date(data.startDate), {
    message: 'Registration must close on or before the opportunity start date.',
    path: ['registerEndAt'],
  })

export function parseOpportunityForm(values) {
  return opportunitySchema.safeParse(values)
}