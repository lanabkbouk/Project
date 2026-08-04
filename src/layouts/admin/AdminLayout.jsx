import Typography from '../../components/ui/Typography'
import { PANEL_SURFACE } from '../../utils/surfaceStyles'
import AdminSidebar from '../../components/admin/AdminSidebar'

export default function AdminLayout({ eyebrow, title, description, actions, children }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        <AdminSidebar />

        <div className="min-w-0 space-y-6">
          {(title || description || actions || eyebrow) && (
            <section className={`${PANEL_SURFACE} p-6 md:p-8`}>
              {eyebrow && (
                <Typography variant="overline" className="text-body/70">
                  {eyebrow}
                </Typography>
              )}

              <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                  {title && (
                    <Typography variant="sectionTitle" className="text-3xl sm:text-4xl">
                      {title}
                    </Typography>
                  )}

                  {description && (
                    <Typography variant="body" className="max-w-3xl text-body">
                      {description}
                    </Typography>
                  )}
                </div>

                {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
              </div>
            </section>
          )}

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  )
}