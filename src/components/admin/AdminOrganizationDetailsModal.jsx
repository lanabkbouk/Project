import { useMemo, useState } from 'react'
import { Building2, ExternalLink, FileText, Image as ImageIcon, Maximize2 } from 'lucide-react'

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
  if (status === ORGANIZATION_STATUS.VERIFIED) return 'Approved'
  if (status === ORGANIZATION_STATUS.REJECTED) return 'Rejected'
  return 'Pending'
}

function getDocumentKind(url = '') {
  const cleanUrl = String(url).split('?')[0].toLowerCase()

  if (/\.(png|jpe?g|gif|webp|avif|svg)$/.test(cleanUrl)) return 'image'
  if (/\.pdf$/.test(cleanUrl)) return 'pdf'

  return 'unknown'
}

export default function AdminOrganizationDetailsModal({
  open,
  organization,
  onClose,
  onApprove,
  onReject,
  isSubmitting,
}) {
  const [isDocumentPreviewOpen, setIsDocumentPreviewOpen] = useState(false)

  const status = organization?.status || ORGANIZATION_STATUS.PENDING
  const statusTone = getStatusTone(status)
  const isVerified = status === ORGANIZATION_STATUS.VERIFIED
  const isRejected = status === ORGANIZATION_STATUS.REJECTED
  const verificationDocumentUrl = organization?.verificationDocumentUrl || ''
  const documentKind = useMemo(() => getDocumentKind(verificationDocumentUrl), [verificationDocumentUrl])
  const hasVerificationDocument = Boolean(verificationDocumentUrl)
  const documentPreviewTitle =
    documentKind === 'image'
      ? 'Verification document image preview'
      : documentKind === 'pdf'
        ? 'Verification document PDF preview'
        : 'Verification document preview'

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
            Approve
          </Button>
          <Button
            variant="danger"
            onClick={() => onReject?.(organization)}
            disabled={isSubmitting || isRejected}
          >
            Reject
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
            {organization.reviewedAt ? (
              <InfoRow label="Reviewed at" value={formatDateTime(organization.reviewedAt)} />
            ) : null}
          </div>

          <section className="rounded-2xl border border-heading/10 bg-bg/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Typography variant="h5">Verification document</Typography>
                <Typography variant="bodySm" className="mt-1 text-body">
                  The uploaded official document is shown below and can be opened larger when needed.
                </Typography>
              </div>

              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsDocumentPreviewOpen(true)}
                disabled={!hasVerificationDocument}
              >
                <Maximize2 size={16} />
                <span className="ml-1">Open larger preview</span>
              </Button>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-heading/10 bg-bg">
              {hasVerificationDocument ? (
                documentKind === 'image' ? (
                  <img
                    src={verificationDocumentUrl}
                    alt={`${organization.name || 'Organization'} verification document`}
                    className="max-h-[22rem] w-full object-contain"
                  />
                ) : documentKind === 'pdf' ? (
                  <iframe
                    src={verificationDocumentUrl}
                    title={documentPreviewTitle}
                    className="h-[22rem] w-full border-0"
                  />
                ) : (
                  <div className="flex min-h-[14rem] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <FileText size={28} aria-hidden="true" />
                    </div>
                    <div>
                      <Typography variant="h6">Document preview unavailable</Typography>
                      <Typography variant="bodySm" className="mt-1 text-body">
                        Open the file in a new tab to review the uploaded document.
                      </Typography>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex min-h-[14rem] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-heading/5 text-body">
                    <ImageIcon size={28} aria-hidden="true" />
                  </div>
                  <div>
                    <Typography variant="h6">No verification document uploaded</Typography>
                    <Typography variant="bodySm" className="mt-1 text-body">
                      The organization did not provide a verification file during registration.
                    </Typography>
                  </div>
                </div>
              )}
            </div>

            {hasVerificationDocument && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button as="a" variant="ghost" size="small" href={verificationDocumentUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} />
                  <span className="ml-1">Open file in new tab</span>
                </Button>
                <Typography variant="bodySm" className="text-body">
                  {documentKind === 'image' ? 'Image file preview' : documentKind === 'pdf' ? 'PDF file preview' : 'Generic file preview'}
                </Typography>
              </div>
            )}
          </section>
        </div>
      )}

      <Modal
        open={isDocumentPreviewOpen}
        onClose={() => setIsDocumentPreviewOpen(false)}
        title="Verification document preview"
        dialogClassName="max-w-5xl"
      >
        {hasVerificationDocument ? (
          <div className="space-y-4">
            <Typography variant="bodySm" className="text-body">
              Review the uploaded document in a larger view. Use the file link if your browser blocks embedded previews.
            </Typography>

            <div className="overflow-hidden rounded-2xl border border-heading/10 bg-bg">
              {documentKind === 'image' ? (
                <img
                  src={verificationDocumentUrl}
                  alt={`${organization?.name || 'Organization'} verification document preview`}
                  className="max-h-[75vh] w-full object-contain"
                />
              ) : documentKind === 'pdf' ? (
                <iframe
                  src={verificationDocumentUrl}
                  title={documentPreviewTitle}
                  className="h-[75vh] w-full border-0"
                />
              ) : (
                <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <FileText size={34} aria-hidden="true" />
                  </div>
                  <div>
                    <Typography variant="h5">Preview not available</Typography>
                    <Typography variant="bodySm" className="mt-1 text-body">
                      Open the file in a new tab to inspect the uploaded document.
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Typography variant="bodySm" className="text-body">
            No verification document is available for this organization.
          </Typography>
        )}
      </Modal>
    </Modal>
  )
}