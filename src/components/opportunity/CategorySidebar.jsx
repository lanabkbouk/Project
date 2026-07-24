import { Search } from "lucide-react";
import Input from "../ui/Input";

export default function CategorySidebar({
  categories,
  activeCategoryId,
  onSelectCategory,
  searchValue,
  onSearchChange,
}) {
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

      <div className="rounded-3xl bg-heading/5 border border-heading/10 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-heading/60 mb-3">
          Categories
        </h3>

        <ul className="flex flex-col gap-1">
          <li>
            <button
              type="button"
              onClick={() => onSelectCategory("")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                activeCategoryId === ""
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-heading/70 hover:bg-primary/5"
              }`}
            >
              All Opportunities
            </button>
          </li>

          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                  activeCategoryId === category.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-heading/70 hover:bg-primary/5"
                }`}
              >
                <span>{category.name}</span>
                <span className="text-xs text-heading/40">({category.opportunitiesCount})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}