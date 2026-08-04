// قسم إدارة عام (عنوان + وصف + زر إضافة + قائمة/تحميل/فارغ) — نفس
// الهيكل بالضبط مطلوب لقسمي "التصنيفات" و"المهارات"، فبدل ما نكرره
// مرتين، هاد الـ wrapper بياخد العنصر الجاهز للعرض عبر renderItem
// (Render Prop) ويهتم هو بحالات التحميل/الفراغ فقط.

import { Plus } from 'lucide-react'
import Typography from '../ui/Typography'
import Skeleton from '../ui/Skeleton'
import Button from '../ui/Button'
import EmptyState from '../common/EmptyState'
import { CARD_SURFACE } from '../../utils/surfaceStyles'

export default function CatalogSection({
  title,
  description,
  addLabel,
  onAdd,
  items,
  isLoading,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  renderItem,
}) {
  return (
    <section>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <Typography variant="h4">{title}</Typography>
          {description && (
            <Typography variant="bodySm" className="text-body mt-1">
              {description}
            </Typography>
          )}
        </div>

        <Button variant="primary" size="small" onClick={onAdd} className="flex items-center gap-1 shrink-0">
          <Plus size={16} />
          {addLabel}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${CARD_SURFACE} p-4`}>
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="flex flex-col gap-3">{items.map(renderItem)}</div>
      )}
    </section>
  )
}