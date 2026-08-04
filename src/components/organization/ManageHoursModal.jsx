// مودال "Manage Hours" — تفتحه المنظمة بس على متقدّم مقبول بعد ما
// الفرصة تخلص فعليًا (راجع الشرط بـ ApplicantCard.jsx). يفتح دايمًا
// معبّى برقم committedHours (الالتزام الأصلي)، والمنظمة بس تأكده أو
// تعدّله لو المتطوع اشتغل فعليًا أكتر/أقل — نفس فلسفة أي مودال تعديل
// بالمشروع (CategoryFormModal مثلًا): قيمة ابتدائية جاهزة، مش صفر.

import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function ManageHoursModal({
  open,
  onClose,
  onConfirm,
  volunteerName,
  committedHours,
  currentHoursLogged,
  isSubmitting,
}) {
  // لو فيه رقم مؤكد سابقًا (تعديل ثانٍ) منبلّش منه، وإلا من رقم الالتزام
  const [hours, setHours] = useState(
    currentHoursLogged !== null && currentHoursLogged !== undefined
      ? currentHoursLogged
      : committedHours,
  );
  const [error, setError] = useState("");

  const handleConfirm = () => {
    const value = Number(hours);
    if (!Number.isFinite(value) || value < 0) {
      setError("Please enter a valid number of hours.");
      return;
    }
    setError("");
    onConfirm(value);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Confirm hours — ${volunteerName || "volunteer"}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} isLoading={isSubmitting} loadingText="Saving...">
            Confirm hours
          </Button>
        </>
      }
    >
      <p className="mb-4">
        This volunteer committed to <strong>{committedHours}</strong> hours when joining. Confirm
        the actual hours they completed, or adjust if it differs.
      </p>

      <Input
        label="Actual hours completed"
        name="actualHours"
        type="number"
        min={0}
        value={hours}
        onChange={(event) => setHours(event.target.value)}
        error={error}
        fullWidth
        required
      />
    </Modal>
  );
}