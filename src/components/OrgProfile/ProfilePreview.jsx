// components/OrgProfile/ProfilePreview.jsx
//
// بطاقة معاينة (Read-only) تعرض ملخص بيانات المنظمة المُدخلة بالفورم
// المجاور. مبنية بنفس البنية بالضبط متل volunteerProfile/ProfilePreview.jsx
// (نفس الحاوية، نفس InfoRow، نفس تنسيق القسم الأخير) — بروفايل المتطوع
// هو المرجع، وهاي الصفحة تتبعه بالتصميم، مو العكس.

import InfoRow from "../ui/InfoRow";

export default function OrgProfilePreview({ organization }) {
  if (!organization) return null;

  return (
    <div className="rounded-3xl bg-heading/5 border border-heading/10 p-6 md:p-8">
      <h2 className="text-lg font-semibold mb-4 text-heading">Preview</h2>

      <div className="space-y-4">
        <InfoRow label="Name" value={organization.name} />
        <InfoRow label="Email" value={organization.email} />
        <InfoRow label="Governorate" value={organization.city} />
        <InfoRow label="Website" value={organization.website} />

        {/* Description — نفس تنسيق قسم "About" بمعاينة بروفايل المتطوع بالضبط */}
        <div className="pt-2 border-t border-heading/10">
          <h3 className="font-semibold mb-2 text-heading">Description</h3>
          <p className="text-sm text-heading/80 leading-relaxed">
            {organization.description || "Write something about your organization to appear here."}
          </p>
        </div>
      </div>
    </div>
  );
}