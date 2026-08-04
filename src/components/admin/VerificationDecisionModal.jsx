// مودال تأكيد رفض توثيق منظمة، مع سبب اختياري يُعرض للمنظمة لاحقًا عبر
// VerificationStatusBanner الموجود أصلًا بصفحتها. القبول لا يحتاج مودال
// (فعل بسيط بلا سبب مطلوب)، لذلك هذا المودال خاص بالرفض فقط.

import { useState } from 'react'
import Modal from '../ui/Modal'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'

export default function VerificationDecisionModal({ open, organizationName, onClose, onConfirm, isSubmitting }) {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    onConfirm(reason.trim())
    setReason('')
  }

  const handleClose = () => {
    setReason('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Reject ${organizationName || 'organization'}?`}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Confirm rejection
          </Button>
        </>
      }
    >
      <p className="mb-4 text-body">
        The organization stays visible in the review list, but its status will change to rejected.
        Add a short reason so the team knows what to fix before requesting verification again.
      </p>

      <Textarea
        name="rejectionReason"
        placeholder="e.g. The uploaded document is unreadable, please re-upload a clearer copy."
        rows={4}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
    </Modal>
  )
}