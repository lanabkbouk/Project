// نقطة واحدة لتتبّع آخر status توثيق (verified/rejected) شافته المنظمة
// لحسابها، عبر localStorage. نفس فلسفة participationStatusSeenTracker.js
// بالضبط — id→status (Map)، حتى لو الأدمن غيّر القرار أكتر من مرة
// (رفض ثم قبول لاحقًا مثلًا)، كل تغيير فعلي يرجع يظهر كتنبيه "جديد".

const SEEN_KEY = "organization:seenVerificationStatus";

export function getSeenOrganizationStatusMap() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Map(Object.entries(JSON.parse(raw))) : new Map();
  } catch {
    return new Map();
  }
}

export function markOrganizationStatusSeen(organizationId, status) {
  if (!organizationId) return;

  const current = getSeenOrganizationStatusMap();
  current.set(String(organizationId), status);

  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(Object.fromEntries(current)));
  } catch {
    // تجاهل أي خطأ تخزين (وضع التصفح الخاص، أو تجاوز الحصة المسموحة)
  }
}
