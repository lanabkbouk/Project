// components/orgProfile/VerificationStatusBanner.jsx
//
// يعرض حالة توثيق المنظمة بشكل واضح بأعلى الصفحة. لا يظهر إطلاقًا لما
// تكون الحالة "verified" لأنه ما في داعي نزعج منظمة موثّقة برسالة دائمة.

import { Clock, CheckCircle2, XCircle, Ban } from 'lucide-react'
import { ORGANIZATION_STATUS, getOrganizationStatusMeta } from '../../constants/organizationStatus'

const STATUS_ICONS = {
  [ORGANIZATION_STATUS.PENDING]: Clock,
  [ORGANIZATION_STATUS.VERIFIED]: CheckCircle2,
  [ORGANIZATION_STATUS.REJECTED]: XCircle,
  [ORGANIZATION_STATUS.SUSPENDED]: Ban,
}

export default function VerificationStatusBanner({ status, rejectionReason }) {
  if (!status || status === ORGANIZATION_STATUS.VERIFIED) return null

  const meta = getOrganizationStatusMeta(status)
  const Icon = STATUS_ICONS[status] ?? Clock

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-2xl border p-4 mb-8 ${meta.bannerClassName}`}
    >
      <Icon size={20} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold">{meta.label}</p>
        <p className="text-sm mt-1">{meta.message}</p>
        {status === ORGANIZATION_STATUS.REJECTED && rejectionReason && (
          <p className="text-sm mt-2 italic">"{rejectionReason}"</p>
        )}
      </div>
    </div>
  )
}