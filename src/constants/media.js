

// الأنواع المسموحة لرفع أي صورة (بروفايل متطوع / منظمة / فرصة لاحقًا)
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// الحد الأقصى لحجم الصورة الواحدة (بالميجابايت)
export const MAX_IMAGE_SIZE_MB = 2

export const MEDIA_COLLECTIONS = {
  VOLUNTEER_PHOTO: 'profile_photo',
  ORGANIZATION_PHOTO: 'profile_image',
  ORGANIZATION_VERIFICATION_DOCS: 'verification_documents',
  // TODO: يضاف هون لما يجهز الباك اند مسار صور الفرص
  // OPPORTUNITY_IMAGE: 'opportunity_image',
}