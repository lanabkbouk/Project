// components/opportunity/CategorySidebar.jsx
//
// شريط فلترة صفحة تصفح الفرص — بحث + فئات + مهارات، كلها اختيار
// متعدد (Checkboxes) بدل اختيار مفرد سابقًا. الحالة نفسها (أي الفئات/
// المهارات المختارة) تُدار بالكامل من الصفحة الأم (OpportunitiesListPage)
// ومربوطة بالـ URL هناك — هذا المكوّن عرض بحت بدون أي حالة داخلية.

import { Search } from "lucide-react";
import Input from "../ui/Input";
import { PANEL_SURFACE } from "../../utils/surfaceStyles";

function FilterCheckbox({ label, count, checked, onChange }) {
  return (
    <label className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-primary/5">
      <span className="flex items-center gap-2 min-w-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 shrink-0 rounded border-heading/20 text-primary focus:ring-primary/40"
        />
        <span className={`truncate ${checked ? "font-semibold text-primary" : "text-heading/70"}`}>
          {label}
        </span>
      </span>
      {typeof count === "number" && <span className="shrink-0 text-xs text-heading/40">({count})</span>}
    </label>
  );
}

export default function CategorySidebar({
  categories,
  selectedCategoryIds,
  onToggleCategory,
  skills = [],
  selectedSkillIds = [],
  onToggleSkill,
  searchValue,
  onSearchChange,
  onClearAll,
}) {
  const hasActiveFilters = selectedCategoryIds.length > 0 || selectedSkillIds.length > 0;

  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
      {onSearchChange ? (
        <Input
          name="opportunity-search"
          placeholder="Search opportunities..."
          icon={Search}
          variant="filled"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      ) : null}

      <div className={`${PANEL_SURFACE} p-5`}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-heading/60">Categories</h3>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-medium text-primary hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          {categories.map((category) => (
            <FilterCheckbox
              key={category.id}
              label={category.name}
              count={category.opportunitiesCount}
              checked={selectedCategoryIds.includes(category.id)}
              onChange={() => onToggleCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {skills.length > 0 && (
        <div className={`${PANEL_SURFACE} p-5`}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-heading/60">Skills</h3>

          <div className="flex flex-col gap-0.5 max-h-64 overflow-y-auto">
            {skills.map((skill) => (
              <FilterCheckbox
                key={skill.id}
                label={skill.name}
                checked={selectedSkillIds.includes(skill.id)}
                onChange={() => onToggleSkill(skill.id)}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}