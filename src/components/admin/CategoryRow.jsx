import { Pencil, Trash2 } from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../common/Badge'
import { CARD_BASE } from '../../utils/surfaceStyles'

export default function CategoryRow({ category, onEdit, onDelete, isDeleting }) {
  const opportunitiesCount = category.opportunitiesCount ?? 0

  return (
    <div className={`${CARD_BASE} flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-heading">{category.name}</h3>
          <Badge
            label={`${opportunitiesCount} opportunit${opportunitiesCount === 1 ? 'y' : 'ies'}`}
            tone="neutral"
          />
        </div>

        <p className="mt-1 text-sm text-body line-clamp-2">
          {category.description || 'No description provided.'}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="small"
          onClick={() => onEdit(category)}
          aria-label={`Edit ${category.name}`}
        >
          <Pencil size={16} />
        </Button>
        <Button
          variant="ghost"
          size="small"
          disabled={isDeleting}
          onClick={() => onDelete(category)}
          className="text-danger hover:bg-danger/10"
          aria-label={`Delete ${category.name}`}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  )
}