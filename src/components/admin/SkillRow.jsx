import { Pencil, Trash2 } from 'lucide-react'
import Button from '../ui/Button'
import Chip from '../ui/Chip'
import { CARD_BASE } from '../../utils/surfaceStyles'

export default function SkillRow({ skill, onEdit, onDelete, isDeleting }) {
  return (
    <div className={`${CARD_BASE} flex items-center justify-between gap-4`}>
      <div className="flex items-center gap-2 min-w-0">
        <h3 className="font-semibold text-heading truncate">{skill.name}</h3>
        {skill.category?.name && <Chip color="blue">{skill.category.name}</Chip>}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="small" onClick={() => onEdit(skill)} aria-label={`Edit ${skill.name}`}>
          <Pencil size={16} />
        </Button>
        <Button
          variant="ghost"
          size="small"
          disabled={isDeleting}
          onClick={() => onDelete(skill)}
          className="text-danger hover:bg-danger/10"
          aria-label={`Delete ${skill.name}`}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  )
}