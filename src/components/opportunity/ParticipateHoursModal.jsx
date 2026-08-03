
// نافذة تأكيد صغيرة تظهر لما المتطوع يضغط "Participate" — بتطلب منه رقم
// واحد بس: أقل عدد ساعات هو مستعد يلتزم فيها بهاي الفرصة (مو اختيار بين
// مستويين/حدّين). الشرط الوحيد: هالرقم لازم يكون على الأقل minHours تبع
// الفرصة (الحد الأدنى المطلوب من المنظمة) — بدون سقف أعلى يفرض عليه هون.
//
// التحقق هون خط دفاع أول بس — الخدمة (opportunities.js) بترفض أي قيمة
// أقل من الحد الأدنى حتى لو تجاوزت هالتحقق هون، والباك اند الحقيقي لازم
// يتحقق نفس الشي كمان.

import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function ParticipateHoursModal({
  open,
  onClose,
  onConfirm,
  minHours,
  submitting = false,
  serverError = "",
}) {
  // نبدأ دايمًا بالحد الأدنى تبع الفرصة — أكثر قيمة منطقية كنقطة انطلاق
  const [hours, setHours] = useState(minHours);
  const [localError, setLocalError] = useState("");

  function handleConfirm() {
    const value = Number(hours);
    if (!Number.isFinite(value) || value < minHours) {
      setLocalError(`Please enter at least ${minHours} hours.`);
      return;
    }
    setLocalError("");
    onConfirm(value);
  }

  // خطأ الخادم (لو صار) له الأولوية بالعرض على خطأ التحقق المحلي —
  // لو ظهر يعني الرقم كان صحيح شكليًا لكن الخادم رفضه لسبب آخر (تسجيل
  // اتقفل بالثانية الأخيرة مثلًا)
  const displayedError = serverError || localError;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Minimum hours you can commit"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} isLoading={submitting} loadingText="Joining...">
            Confirm & Join
          </Button>
        </>
      }
    >
      <p className="mb-4">
        This opportunity requires at least <strong>{minHours}</strong> hours per volunteer. Enter
        the minimum number of hours you can commit to it.
      </p>

      <Input
        label="Minimum hours you can commit"
        name="committedHours"
        type="number"
        min={minHours}
        value={hours}
        onChange={(event) => setHours(event.target.value)}
        error={displayedError}
        fullWidth
        required
      />
    </Modal>
  );
}