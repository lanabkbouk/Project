// مودال واحد يخدم حالتي الإنشاء والتعديل معًا: لو category=null فهو
// إنشاء تصنيف جديد، ولو فيها قيمة فهو تعديل عليها — نفس الفورم بالضبط،
// فرق بسيط بالعنوان وزر التأكيد فقط، فما في داعي مودالين منفصلين.

import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'

const EMPTY_FORM = { name: '', description: '' }

export default function CategoryFormModal({ open, category, onClose, onSubmit, isSubmitting, error }) {
  // القيمة الابتدائية بتتحدد مرة وحدة بس عند أول رندر — الصفحة الأم
  // (AdminCatalogManagement) بتعيد إنشاء هالمكوّن من جديد (key مرتبط
  // بهوية التصنيف) كل ما تفتحيه على عنصر مختلف، فمفيش داعي لـ useEffect
  // يزامن الفورم مع category لاحقًا
  const [form, setForm] = useState(() =>
    category ? { name: category.name, description: category.description } : EMPTY_FORM,
  )
  const isEditing = Boolean(category)

  const handleChange = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = () => onSubmit(form)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit "${category?.name}"` : 'New category'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!form.name.trim() || !form.description.trim()}
            loadingText="Saving..."
          >
            {isEditing ? 'Save changes' : 'Create category'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {error && <p className="text-sm text-danger">{error}</p>}

        <Input
          label="Name"
          name="name"
          required
          value={form.name}
          onChange={handleChange('name')}
          placeholder="e.g. Environment"
        />

        <Textarea
          label="Description"
          name="description"
          required
          rows={3}
          value={form.description}
          onChange={handleChange('description')}
          placeholder="Short description shown to volunteers and organizations"
        />
      </div>
    </Modal>
  )
}