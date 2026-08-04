import { useMemo, useState } from 'react'
import { Plus, Search, Tags } from 'lucide-react'

import AdminLayout from '../../layouts/admin/AdminLayout'
import CategoryRow from '../../components/admin/CategoryRow'
import CategoryFormModal from '../../components/admin/CategoryFormModal'
import Toast from '../../components/common/Toast'
import EmptyState from '../../components/common/EmptyState'
import Badge from '../../components/common/Badge'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Typography from '../../components/ui/Typography'
import { PANEL_SURFACE } from '../../utils/surfaceStyles'
import { useCategoriesQuery } from '../../hooks/queries/useCategoriesQuery'
import { useCreateCategoryMutation } from '../../hooks/queries/useCreateCategoryMutation'
import { useUpdateCategoryMutation } from '../../hooks/queries/useUpdateCategoryMutation'
import { useDeleteCategoryMutation } from '../../hooks/queries/useDeleteCategoryMutation'
import { useToast } from '../../hooks/useToast'

function normalizeName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

export default function AdminCatalogManagement() {
  const categoriesQuery = useCategoriesQuery()
  const categories = categoriesQuery.data ?? []

  const { toast, showSuccess, showError, closeToast } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryModal, setCategoryModal] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [formError, setFormError] = useState('')

  const createCategoryMutation = useCreateCategoryMutation()
  const updateCategoryMutation = useUpdateCategoryMutation()
  const deleteCategoryMutation = useDeleteCategoryMutation()

  const isEditingCategory = Boolean(categoryModal && categoryModal.id)
  const categoryMutation = isEditingCategory ? updateCategoryMutation : createCategoryMutation

  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) return categories

    return categories.filter((category) => {
      const haystack = [category.name, category.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedSearch)
    })
  }, [categories, searchTerm])

  const openCreateModal = () => {
    setFormError('')
    setCategoryModal({})
  }

  const openEditModal = (category) => {
    setFormError('')
    setCategoryModal(category)
  }

  const handleSubmitCategory = async (form) => {
    const normalizedIncomingName = normalizeName(form.name)
    const duplicateCategory = categories.find(
      (category) =>
        normalizeName(category.name) === normalizedIncomingName && category.id !== categoryModal?.id,
    )

    if (duplicateCategory) {
      setFormError('A category with this name already exists.')
      return
    }

    const result = isEditingCategory
      ? await updateCategoryMutation.mutateAsync({ categoryId: categoryModal.id, payload: form })
      : await createCategoryMutation.mutateAsync(form)

    if (!result.success) {
      setFormError(result.error || 'Failed to save category')
      return
    }

    showSuccess(isEditingCategory ? 'Category updated.' : 'Category created.')
    setCategoryModal(null)
    setFormError('')
  }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return

    const result = await deleteCategoryMutation.mutateAsync(categoryToDelete.id)
    if (!result.success) {
      showError(result.error || 'Failed to delete category')
      return
    }

    showSuccess('Category deleted.')
    setCategoryToDelete(null)
  }

  const headerActions = (
    <Button variant="primary" onClick={openCreateModal} className="flex items-center gap-2">
      <Plus size={16} />
      Add category
    </Button>
  )

  return (
    <AdminLayout
      eyebrow="Administrative workspace"
      title="Category management"
      description="Create, update, search, and remove professional categories used across the platform. Duplicate names are blocked before saving."
      actions={headerActions}
    >
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className={`${PANEL_SURFACE} p-5 md:p-6`}>
          <Typography variant="h4">Search categories</Typography>
          <Typography variant="bodySm" className="mt-1 text-body">
            {categories.length} total categories currently configured.
          </Typography>

          <div className="mt-4 max-w-2xl">
            <Input
              name="categorySearch"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or description"
              icon={Search}
              aria-label="Search categories"
            />
          </div>
        </div>

        <div className="flex items-stretch">
          <div className={`${PANEL_SURFACE} w-full p-5 md:p-6`}>
            <Typography variant="overline" className="text-body/70">
              Total categories
            </Typography>
            <div className="mt-3 flex items-end justify-between gap-4">
              <Typography variant="h2">{categories.length}</Typography>
              <Badge label="Platform wide" tone="primary" />
            </div>
            <Typography variant="bodySm" className="mt-3 text-body">
              Categories are shared across opportunities and related forms.
            </Typography>
          </div>
        </div>
      </section>

      {categoriesQuery.isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 rounded-2xl border border-heading/10 bg-field/60" />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title={searchTerm ? 'No matching categories' : 'No categories yet'}
          description={
            searchTerm
              ? 'Try a different search term or clear the filter.'
              : 'Add the first category to start organizing opportunities.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredCategories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={openEditModal}
              onDelete={setCategoryToDelete}
              isDeleting={deleteCategoryMutation.isPending && deleteCategoryMutation.variables === category.id}
            />
          ))}
        </div>
      )}

      <CategoryFormModal
        key={categoryModal ? categoryModal.id ?? 'new' : 'closed'}
        open={Boolean(categoryModal)}
        category={isEditingCategory ? categoryModal : null}
        onClose={() => {
          setCategoryModal(null)
          setFormError('')
        }}
        onSubmit={handleSubmitCategory}
        isSubmitting={categoryMutation.isPending}
        error={formError || (categoryMutation.data?.success === false ? categoryMutation.data.error : null)}
      />

      <Modal
        open={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        title={`Delete ${categoryToDelete?.name || 'category'}?`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCategoryToDelete(null)} disabled={deleteCategoryMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCategory}
              isLoading={deleteCategoryMutation.isPending}
              loadingText="Deleting..."
            >
              Delete category
            </Button>
          </>
        }
      >
        <Typography variant="body" className="text-body">
          This category will be removed from the platform. Opportunities linked to it will need a
          replacement category.
        </Typography>
      </Modal>

      <Toast message={toast.message} variant={toast.variant} duration={7000} onClose={closeToast} />
    </AdminLayout>
  )
}