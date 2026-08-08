// بطاقة معلومات مدمجة تُعرض قبل ما المتطوع يتقدّم بطلب — تشرح دورة حياة
// الفرصة كمراحل متسلسلة، وسياسة السحب ضمن نفس البطاقة (مش قسم منفصل).
// مكوّن عرض بحت (بدون أي جلب بيانات)؛ سياسة السحب مصدرها
// WITHDRAWAL_POLICY_META نفسها المستخدمة بتلميح زر الانسحاب على بطاقة
// "My Volunteering" (ParticipationCard) — حتى ما ينحرف النص عن بعضه.
//
// ⚠️ لا لون مستقل أو مكتوب يدويًا بهاد الملف إطلاقًا — كل لون/أيقونة
// لمرحلة تمثّل حالة حقيقية مسحوبة من المصدر المركزي (getDisplayStatusMeta
// في utils/participationDisplayStatus.js) بالضبط، فأي تعديل مستقبلي
// على لون حالة معيّنة بالمصدر المركزي بينعكس هون تلقائيًا. المراحل يلي
// مالها حالة مخزّنة فعليًا بالنظام هلق (Applied، Certificate Issued)
// بتاخد نمط "قادم/غير مفعّل بعد" محايد (حدود متقطّعة + شفافية أخف +
// أيقونة دائرة فاضية) بدل أي لون يوحي إنها حالة نشطة فعليًا.
//
// لا يوجد مكوّن Steps/Stepper جاهز بالمشروع، فهاد أول واحد — بسيط وقابل
// لإعادة الاستخدام (props بس، بدون أي منطق خاص بصفحة معيّنة).

import { Circle } from "lucide-react";
import { PANEL_SURFACE } from "../../utils/surfaceStyles";
import Typography from "../ui/Typography";
import Chip from "../ui/Chip";
import { WITHDRAWAL_POLICY_META } from "../../utils/participationPolicy";
import { getDisplayStatusMeta, PARTICIPATION_DISPLAY_STATUS } from "../../utils/participationDisplayStatus";

// كل مرحلة بمصدر لونها/أيقونتها الحقيقي: Under Review/Accepted حالتا
// مشاركة حقيقيتان (PARTICIPATION_STATUS_META عبر getDisplayStatusMeta)،
// Active/Completed مُشتقّتان من حالة الفرصة نفسها (OPPORTUNITY_STATUS_META
// — نفس قرار getParticipationStatusMeta بالضبط). Applied وCertificate
// Issued ما إلهم قيمة PARTICIPATION_STATUS مخزّنة فعليًا هلق (التقديم
// نفسه بيصير pending فورًا، والشهادات مش ميزة مفعّلة بعد) فـ meta بترجع
// null قصدًا، فيوخدوا النمط المحايد تحت
const LIFECYCLE_STEPS = [
  { label: "Applied", meta: null },
  { label: "Under Review", meta: getDisplayStatusMeta(PARTICIPATION_DISPLAY_STATUS.PENDING) },
  { label: "Accepted", meta: getDisplayStatusMeta(PARTICIPATION_DISPLAY_STATUS.ACCEPTED) },
  { label: "Active", meta: getDisplayStatusMeta(PARTICIPATION_DISPLAY_STATUS.ACTIVE) },
  { label: "Completed", meta: getDisplayStatusMeta(PARTICIPATION_DISPLAY_STATUS.COMPLETED) },
  { label: "Certificate Issued", meta: null },
];

function StepChip({ label, meta }) {
  if (!meta) {
    return (
      <Chip color="gray" className="inline-flex items-center gap-1 !py-0.5 !text-xs border-dashed opacity-70">
        <Circle size={12} aria-hidden="true" />
        {label}
      </Chip>
    );
  }

  const Icon = meta.icon;

  return (
    <Chip color={meta.color} className="inline-flex items-center gap-1 !py-0.5 !text-xs">
      {Icon && <Icon size={12} aria-hidden="true" />}
      {label}
    </Chip>
  );
}

export default function OpportunityLifecycleCard() {
  return (
    <div className={`${PANEL_SURFACE} p-5 mb-8`}>
      <Typography variant="h5" className="mb-3">
        How this works
      </Typography>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2 mb-5">
        {LIFECYCLE_STEPS.map((step, index) => (
          <li key={step.label} className="flex items-center gap-1.5">
            <StepChip label={step.label} meta={step.meta} />
            {index < LIFECYCLE_STEPS.length - 1 && (
              <span className="text-heading/20" aria-hidden="true">
                →
              </span>
            )}
          </li>
        ))}
      </ol>

      <Typography variant="h6" className="mb-2">
        Withdrawal Policy
      </Typography>
      <ul className="flex flex-col gap-1.5">
        {WITHDRAWAL_POLICY_META.map((entry) => {
          const meta = getDisplayStatusMeta(entry.displayStatus);
          const Icon = meta?.icon;

          return (
            <li key={entry.displayStatus} className="flex items-start gap-2 text-xs text-body">
              <Chip
                color={meta?.color || "gray"}
                className="inline-flex items-center gap-1 !py-0.5 !text-[11px] shrink-0"
              >
                {Icon && <Icon size={11} aria-hidden="true" />}
                {entry.label}
              </Chip>
              <span className="leading-relaxed">{entry.description}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
