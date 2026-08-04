import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, UserRound } from 'lucide-react'

import AdminLayout from '../../layouts/admin/AdminLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/ui/Button'
import InfoRow from '../../components/ui/InfoRow'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Textarea from '../../components/ui/Textarea'
import Toast from '../../components/common/Toast'
import Typography from '../../components/ui/Typography'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import { ROUTES } from '../../constants/paths'
import { CARD_BASE, PANEL_SURFACE } from '../../utils/surfaceStyles'
import { formatDateTime } from '../../utils/formatDateTime'

const EMPTY_PROFILE = {
  name: '',
  email: '',
  phone: '',
  bio: '',
}

function ProfileEditModal({ open, profile, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_PROFILE)

  useEffect(() => {
    if (!open) return

    setForm(profile || EMPTY_PROFILE)
  }, [open, profile])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit profile"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSubmit(form)} isLoading={isSubmitting} loadingText="Saving...">
            Save changes
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Full name"
          name="admin-name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Full name"
        />
        <Input
          label="Email"
          name="admin-email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="name@example.com"
        />
        <Input
          label="Phone number"
          name="admin-phone"
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
          placeholder="+1 555 000 000"
        />
        <Textarea
          label="Short bio"
          name="admin-bio"
          rows={4}
          value={form.bio}
          onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
          placeholder="Optional short bio for the admin account"
        />
      </div>
    </Modal>
  )
}

function PasswordModal({ open, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  useEffect(() => {
    if (!open) return

    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }, [open])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Change password"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => onSubmit(form)} isLoading={isSubmitting} loadingText="Updating...">
            Update password
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Typography variant="bodySm" className="text-body">
          Use a strong password and keep it unique to the admin account.
        </Typography>

        <Input
          label="Current password"
          name="current-password"
          type="password"
          value={form.currentPassword}
          onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))}
          placeholder="Current password"
        />
        <Input
          label="New password"
          name="new-password"
          type="password"
          value={form.newPassword}
          onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
          placeholder="New password"
        />
        <Input
          label="Confirm password"
          name="confirm-password"
          type="password"
          value={form.confirmPassword}
          onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
          placeholder="Confirm new password"
        />
      </div>
    </Modal>
  )
}

export default function AdminProfile() {
  const { user, updateUser } = useAuth()
  const { toast, showSuccess, showError, closeToast } = useToast()

  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const profile = useMemo(
    () => ({
      name: user?.displayName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || user?.about || '',
    }),
    [user],
  )

  const accountStatus = user?.status || 'Active'
  const createdAt = formatDateTime(user?.createdAt || user?.created_at)
  const lastLogin = formatDateTime(user?.lastLoginAt || user?.last_login_at || user?.lastLogin)

  const handleSubmitProfile = async (form) => {
    setSubmitting(true)

    try {
      updateUser({
        ...user,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
      })

      showSuccess('Profile updated successfully.')
      setEditOpen(false)
    } catch {
      showError('Unable to update profile right now.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitPassword = async (form) => {
    if (!form.newPassword || form.newPassword !== form.confirmPassword) {
      showError('New password and confirmation must match.')
      return
    }

    setSubmitting(true)

    try {
      showSuccess('Password change request completed locally.')
      setPasswordOpen(false)
    } catch {
      showError('Unable to update password right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout
      eyebrow="Administrative workspace"
      title="Profile"
      description="Account-only profile information for the system administrator. Volunteer-specific data is intentionally excluded."
      actions={
        <>
          <Button as={Link} to={ROUTES.ADMIN_SETTINGS} variant="ghost">
            Settings
          </Button>
          <Button as={Link} to={ROUTES.ADMIN_DASHBOARD} variant="primary">
            Back to dashboard
          </Button>
        </>
      }
    >
      <section className={`${PANEL_SURFACE} p-6 md:p-8`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-primary/10 text-primary">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user?.displayName || 'Admin profile'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={28} aria-hidden="true" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Typography variant="h3">{profile.name || 'System administrator'}</Typography>
                <Badge label="System admin" tone="primary" />
              </div>
              <Typography variant="bodySm" className="mt-1 text-body">
                {profile.email || 'No email provided'}
              </Typography>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => setEditOpen(true)}>
              Edit profile
            </Button>
            <Button variant="danger" onClick={() => setPasswordOpen(true)}>
              Change password
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${CARD_BASE} p-5 md:p-6`}>
          <Typography variant="h4">Account information</Typography>
          <div className="mt-4 space-y-1.5">
            <InfoRow label="Full name" value={profile.name || '—'} />
            <InfoRow label="Email" value={profile.email || '—'} />
            <InfoRow label="Phone number" value={profile.phone || '—'} />
            <InfoRow label="Short bio" value={profile.bio || '—'} />
            <InfoRow label="Role" value="System administrator" />
            <InfoRow label="Account status" value={accountStatus} />
            <InfoRow label="Created at" value={createdAt} />
            <InfoRow label="Last login" value={lastLogin} />
          </div>
        </section>

        <section className={`${CARD_BASE} p-5 md:p-6`}>
          <Typography variant="h4">Account notes</Typography>
          <div className="mt-4 space-y-3 text-sm text-body">
            <p>
              The admin profile intentionally keeps account data separate from volunteer and organization
              details.
            </p>
            <p>
              Use the profile editor to update contact details and the password dialog to rotate access
              credentials when needed.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge label="Account only" tone="neutral" />
              <Badge label="No volunteer fields" tone="success" />
            </div>
          </div>
        </section>
      </div>

      <ProfileEditModal
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSubmit={handleSubmitProfile}
        isSubmitting={submitting}
      />

      <PasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSubmit={handleSubmitPassword}
        isSubmitting={submitting}
      />

      <Toast message={toast.message} variant={toast.variant} duration={7000} onClose={closeToast} />
    </AdminLayout>
  )
}