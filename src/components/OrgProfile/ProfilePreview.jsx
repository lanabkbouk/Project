// components/orgProfile/ProfilePreview.jsx
//
// بطاقة معاينة (Read-only) تعرض ملخص بيانات المنظمة المُدخلة بالفورم
// المجاور. تصميمها موحّد مع الفورم (نفس الألوان والمسافات) وتعرض
// حالة التوثيق كـ Badge بدل نص عادي.

import { Globe, MapPin } from 'lucide-react'
import { getOrganizationStatusMeta } from '../../constants/organizationStatus'

// عنصر مساعد لعرض حقل واحد (تسمية + قيمة) بشكل موحّد، لتفادي تكرار
// نفس التنسيق أربع أو خمس مرات داخل الملف
function PreviewField({ icon: Icon, label, value, placeholder }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-heading/70">
          <Icon size={16} />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-body">
          {label}
        </p>
        <p className={`font-medium ${value ? 'text-heading' : 'text-body/70 italic'} break-words`}>
          {value || placeholder}
        </p>
      </div>
    </div>
  )
}

export default function OrgProfilePreview({ organization }) {
  if (!organization) return null

  const statusMeta = getOrganizationStatusMeta(organization.status)

  return (
    // h-full هون فعّالة فقط بشرط أن يكون الأب (Grid) عنده items-stretch
    // بدل items-start، وإلا العنصر بياخد ارتفاعه الطبيعي بس
    <div className="rounded-3xl bg-heading/5 border border-heading/10 p-6 md:p-8 h-full flex flex-col">

      {/* رأس البطاقة: العنوان + بادج الحالة بنفس السطر */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2 className="text-lg font-semibold text-heading">
          Organization Overview
        </h2>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badgeClassName}`}
        >
          {statusMeta.label}
        </span>
      </div>

      {/* الحقول الأساسية */}
      <div className="flex flex-col gap-5 text-sm">
        <PreviewField
          label="Name"
          value={organization.name}
          placeholder="Not provided"
        />

        <PreviewField
          icon={MapPin}
          label="Governorate"
          value={organization.city}
          placeholder="Not specified"
        />

        <PreviewField
          icon={Globe}
          label="Website"
          value={organization.website}
          placeholder="No website provided"
        />
      </div>

      {/* فاصل بصري قبل الوصف */}
      <div className="my-6 border-t border-heading/10" />

      {/* الوصف: ياخد المساحة المتبقية عشان البطاقة تمتلئ بشكل طبيعي */}
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-body mb-1">
          Description
        </p>
        <p className={`font-medium leading-relaxed ${organization.description ? 'text-heading' : 'text-body/70 italic'}`}>
          {organization.description || 'No description provided yet.'}
        </p>
      </div>
    </div>
  )
}