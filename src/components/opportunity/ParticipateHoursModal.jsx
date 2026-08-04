// نافذة تأكيد صغيرة تظهر لما المتطوع يضغط "Participate" — بتطلب منه رقم
// واحد بس: عدد الساعات هو مستعد يلتزم فيها بهاي الفرصة، ولازم يكون
// *جوا* نطاق الفرصة بالكامل [minHours, maxHours] — مش بس أكبر من الحد
// الأدنى، متل ما كان قبل (كانت الواجهة بتقول "at least X hours" وما
// كانت تذكر أو تفرض الحد الأعلى إطلاقًا، فالمتطوع كان يقدر يكتب رقم
// أكبر من طاقة الفرصة الفعلية بدون أي تنبيه).
//
// التحقق هون خط دفاع أول بس — الخدمة (opportunities.js) بترفض أي قيمة
// برا النطاق حتى لو تجاوزت هالتحقق هون، والباك اند الحقيقي لازم يتحقق
// نفس الشي كمان.

import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function ParticipateHoursModal({
  open,
  onClose,
  onConfirm,
  minHours,
  maxHours,
  submitting = false,
  serverError = "",
}) {
  // نبدأ دايمًا بالحد الأدنى تبع الفرصة — أكثر قيمة منطقية كنقطة انطلاق
  const [hours, setHours] = useState(minHours);
  const [localError, setLocalError] = useState("");

  function handleConfirm() {
    const value = Number(hours);
    if (!Number.isFinite(value) || value < minHours || value > maxHours) {
      setLocalError(`Please enter a number between ${minHours} and ${maxHours} hours.`);
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
      title="Hours you can commit"
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
        This opportunity requires between <strong>{minHours}</strong> and{" "}
        <strong>{maxHours}</strong> hours per volunteer. Enter the number of hours you can commit
        to it.
      </p>

      <Input
        label={`Hours you can commit (${minHours}–${maxHours})`}
        name="committedHours"
        type="number"
        min={minHours}
        max={maxHours}
        value={hours}
        onChange={(event) => setHours(event.target.value)}
        error={displayedError}
        fullWidth
        required
      />
    </Modal>
  );
}