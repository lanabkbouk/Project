// ثوابت خيارات الفلترة والفرز لصفحة "المتقدمين" — بملف منفصل عن
// ApplicantsToolbar.jsx (كومبوننت) لأن react-refresh (Fast Refresh)
// بيحتاج أي ملف فيه Component يُصدّر Components بس، لا ثوابت مصدّرة
// معه بنفس الملف.

import { PARTICIPATION_STATUS } from "./participationStatus";

export const APPLICANTS_STATUS_FILTERS = [
  { name: "All statuses", value: "all" },
  { name: "Pending", value: PARTICIPATION_STATUS.PENDING },
  { name: "Accepted", value: PARTICIPATION_STATUS.ACCEPTED },
  { name: "Rejected", value: PARTICIPATION_STATUS.REJECTED },
];

export const APPLICANTS_SORT_OPTIONS = [
  { name: "Newest first", value: "newest" },
  { name: "Oldest first", value: "oldest" },
];