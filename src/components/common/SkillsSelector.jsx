// components/common/SkillsSelector.jsx
//
// اختيار متعدد للمهارات مجمّعة حسب الفئة — مكوّن مشترك (DRY) بين فورم
// بروفايل المتطوع (اختيار مهاراته الشخصية) وفورم إنشاء/تعديل الفرصة
// (تحديد المهارات المطلوبة من المتطوعين)، بدل تكرار نفس منطق التجميع
// والعرض بملفين منفصلين.

import { Controller } from "react-hook-form";
import Skeleton from "../ui/Skeleton";
import Typography from "../ui/Typography";
import {
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  CATEGORY_SELECTED_COLORS,
} from "../../utils/categoryStyles";

export default function SkillsSelector({
  control,
  name = "skills",
  availableSkills = [],
  loading = false,
  error,
  helperText = "Select at least one skill from the list",
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, groupIndex) => (
          <div key={groupIndex} className="rounded-xl border border-heading/10 bg-field p-4">
            <Skeleton className="h-5 w-28 mb-3" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, chipIndex) => (
                <Skeleton key={chipIndex} className="h-7 w-20 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {helperText && (
        <Typography variant="caption" color="muted">
          {helperText}
        </Typography>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field: { value = [], onChange } }) => {
          const grouped = availableSkills.reduce((acc, skill) => {
            const category = skill.category?.name || "Other";
            if (!acc[category]) acc[category] = [];
            acc[category].push(skill);
            return acc;
          }, {});

          return (
            <div className="space-y-4">
              {Object.entries(grouped).map(([category, skills]) => {
                const Icon = CATEGORY_ICONS[category];
                const color = CATEGORY_COLORS[category];

                return (
                  <div
                    key={category}
                    className="rounded-xl border border-heading/10 bg-field p-4 shadow-sm"
                  >
                    {/* عنوان الفئة */}
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md border ${color}`}
                      >
                        {Icon && <Icon size={14} />}
                        {category}
                      </span>
                      <div className="h-px flex-1 bg-heading/10"></div>
                    </div>

                    {/* مهارات الفئة */}
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => {
                        const isSelected = value.includes(skill.id);
                        const selectedClass =
                          CATEGORY_SELECTED_COLORS[category] ||
                          "bg-primary text-bg border-primary";

                        return (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() =>
                              onChange(
                                isSelected
                                  ? value.filter((id) => id !== skill.id)
                                  : [...value, skill.id],
                              )
                            }
                            className={`px-3 py-1.5 rounded-full text-xs border transition ${
                              isSelected
                                ? selectedClass
                                : "bg-field text-heading/70 border-heading/15 hover:border-primary/50"
                            }`}
                          >
                            {skill.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      />

      {error && (
        <Typography variant="caption" color="danger">
          {error}
        </Typography>
      )}
    </div>
  );
}