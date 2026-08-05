import { NavLink } from 'react-router-dom'
import {
  Building2,
  LayoutDashboard,
  MapPin,
  Settings2,
  ShieldCheck,
  Tags,
  UserCircle2,
} from 'lucide-react'

import Badge from '../common/Badge'
import Typography from '../ui/Typography'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../constants/paths'
import { CARD_SURFACE, PANEL_SURFACE } from '../../utils/surfaceStyles'

const navigationSections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
      { label: 'Organization verification', to: ROUTES.ADMIN_ORGANIZATIONS, icon: ShieldCheck },
      { label: 'Categories', to: ROUTES.ADMIN_CATEGORIES, icon: Tags },
      { label: 'Cities', to: ROUTES.ADMIN_CITIES, icon: MapPin },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', to: ROUTES.ADMIN_PROFILE, icon: UserCircle2 },
      { label: 'Settings', to: ROUTES.ADMIN_SETTINGS, icon: Settings2 },
    ],
  },
]

function NavigationLink({ item }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      end={item.to === ROUTES.ADMIN_DASHBOARD}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition',
          isActive
            ? 'border-primary/20 bg-primary/10 text-primary'
            : 'border-transparent bg-transparent text-body hover:border-heading/10 hover:bg-heading/5 hover:text-heading',
        ].join(' ')
      }
    >
      <span className="rounded-xl bg-current/10 p-2">
        <Icon size={16} aria-hidden="true" />
      </span>
      <span className="min-w-0 truncate">{item.label}</span>
    </NavLink>
  )
}

export default function AdminSidebar() {
  const { user } = useAuth()

  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <section className={`${PANEL_SURFACE} p-5 md:p-6`}>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user?.displayName || 'Admin account'}
                className="h-12 w-12 rounded-2xl object-cover"
              />
            ) : (
              <Building2 size={22} aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <Typography variant="h5" className="truncate">
              {user?.displayName || 'System administrator'}
            </Typography>
            <Typography variant="bodySm" className="mt-1 truncate text-body">
              {user?.email || 'Admin account'}
            </Typography>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge label="System admin" tone="primary" />
          <Badge label="Workspace" tone="neutral" />
        </div>
      </section>

      <nav className={`${CARD_SURFACE} p-3 md:p-4`} aria-label="Admin navigation">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-3">
            <Typography variant="overline" className="px-2 text-body/70">
              {section.title}
            </Typography>

            <div className="space-y-1">
              {section.items.map((item) => (
                <NavigationLink key={item.to} item={item} />
              ))}
            </div>

            {section.title === 'Overview' ? <div className="my-4 h-px bg-heading/10" /> : null}
          </div>
        ))}
      </nav>
    </aside>
  )
}