import {
  Building2,
  CalendarClock,
  Globe,
  Mail,
  MapPin,
  Phone,
  UserRound,
  FileText,
} from 'lucide-react'

import Badge from '../common/Badge'
import InfoRow from '../ui/InfoRow'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Typography from '../ui/Typography'
import { ORGANIZATION_STATUS } from '../../constants/organizationStatus'
import { formatDateTime } from '../../utils/formatDateTime'

function getStatusTone(status) {
  if (status === ORGANIZATION_STATUS.VERIFIED) return 'success'
  if (status === ORGANIZATION_STATUS.REJECTED) return 'danger'
  return 'warning'
}

function getStatusLabel(status) {
  if (status === ORGANIZATION_STATUS.VERIFIED) return 'Verified'
  if (status === ORGANIZATION_STATUS.REJECTED) return 'Rejected'
  return 'Pending review'
}

export default function AdminOrganizationDetailsModal({
  open,
  organization,
  onClose,
  onApprove,
  onReject,
  isSubmitting,
}) {
  const status = organization?.status || ORGANIZATION_STATUS.PENDING
  const statusTone = getStatusTone(status)
  const isVerified = status === ORGANIZATION_STATUS.VERIFIED
  const isRejected = status === ORGANIZATION_STATUS.REJECTED

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Organization details"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => onApprove?.(organization)}
            disabled={isSubmitting || isVerified}
            isLoading={isSubmitting}
            loadingText="Approving..."
          >
            Approve verification
          </Button>
          <Button
            variant="danger"
            onClick={() => onReject?.(organization)}
            disabled={isSubmitting || isRejected}
          >
            Reject verification
          </Button>
        </>
      }
    >
      {organization && (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-primary">
              {organization.imageUrl ? (
                <img
                  src={organization.imageUrl}
                  alt={organization.name || 'Organization logo'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 size={24} aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Typography variant="h4" className="truncate">
                  {organization.name || 'Organization'}
                </Typography>
                <Badge label={getStatusLabel(status)} tone={statusTone} />
              </div>

              <Typography variant="bodySm" className="mt-1 text-body">
                {organization.email || 'No email provided'}
              </Typography>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow label="Email" value={organization.email || '—'} />
            <InfoRow label="Phone" value={organization.phone || '—'} />
            <InfoRow label="Registered" value={formatDateTime(organization.requestedAt)} />
            <InfoRow label="City" value={organization.city || '—'} />
            <InfoRow label="Contact person" value={organization.contactPerson || '—'} />
            <InfoRow label="Website" value={organization.website || '—'} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow label="Verification status" value={getStatusLabel(status)} />
            <InfoRow label="Rejection reason" value={organization.rejectionReason || '—'} />
          </div>

          {organization.verificationDocumentUrl && (
            <a
              href={organization.verificationDocumentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <FileText size={16} aria-hidden="true" />
              Open verification document
            </a>
          )}
        </div>
      )}
    </Modal>
  )
}