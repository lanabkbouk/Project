// constants/organizationStatus.js
//
// حالة توثيق حساب المنظمة من قبل السوبر أدمن. مكان واحد لهالثوابت حتى
// أي مكان بالموقع (بروفايل المنظمة، لاحقًا زر نشر فرصة...) يتحقق من نفس
// القيم بالضبط، ونفس التسميات المعروضة للمستخدم.

export const ORGANIZATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
}

export const ORGANIZATION_STATUS_META = {
  [ORGANIZATION_STATUS.PENDING]: {
    label: 'Pending Review',
    message:
      'Your account is currently under review. Some services (such as posting a volunteer opportunity) will remain disabled until your verification document is approved.',
    className: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-700',
  },
  [ORGANIZATION_STATUS.VERIFIED]: {
    label: 'Verified',
    message:
      'Your account has been successfully verified. All platform services are now available.',
    className: 'bg-secondary/10 border-secondary/40 text-secondary',
  },
  [ORGANIZATION_STATUS.REJECTED]: {
    label: 'Verification Rejected',
    message:
      'Your submitted verification document was rejected. Please upload a new, clear document that proves your organization’s identity.',
    className: 'bg-danger/10 border-danger/40 text-danger',
  },
}
