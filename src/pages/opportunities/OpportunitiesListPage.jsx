import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, SearchX, Loader2 } from "lucide-react";
import Typography from "../../components/ui/Typography";
import OpportunityCard from "../../components/opportunity/OpportunityCard";
import CategorySidebar from "../../components/opportunity/CategorySidebar";
import OpportunityTabs, { OPPORTUNITY_TABS } from "../../components/opportunity/OpportunityTabs";
import CardSkeleton from "../../components/ui/CardSkeleton";
import EmptyState from "../../components/common/EmptyState";
import { useCategoriesQuery } from "../../hooks/queries/useCategoriesQuery";
import { useOpportunitiesQuery } from "../../hooks/queries/useOpportunitiesQuery";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useAuth } from "../../context/AuthContext";
import { ACCOUNT_TYPES } from "../../constants/auth/accountTypes";
import { OPPORTUNITY_STATUS } from "../../constants/opportunityStatus";

export default function OpportunitiesListPage() {
  const { isAuthenticated, accountType, user } = useAuth();
  const isVolunteer = isAuthenticated && accountType === ACCOUNT_TYPES.VOLUNTEER;
  const location = useLocation();

  const [search, setSearch] = useState("");
  // لو وصلنا هون من زر تصنيف بصفحة تفاصيل فرصة (CategorySidebar هناك)،
  // categoryId بيوصل عبر location.state — نفس نمط تمرير guardMessage
  // المستخدم بصفحة volunteerProfile. state initializer (function) عشان
  // القراءة تصير مرة وحدة بس عند أول mount، مش بكل re-render
  const [activeCategoryId, setActiveCategoryId] = useState(
    () => location.state?.categoryId || "",
  );
  // التبويب متاح بس للمتطوعين — الزائر والمنظمة بيشوفوا "كل الفرص" دايمًا
  const [activeTab, setActiveTab] = useState(OPPORTUNITY_TABS.ALL);
  const isSuggestedTab = isVolunteer && activeTab === OPPORTUNITY_TABS.SUGGESTED;

  // تأخير 300ms على البحث بس (نفس القيمة القديمة بالضبط) — التبويب
  // المقترح ما بيعتمد على البحث أصلًا فما بيتأثر فيه
  const debouncedSearch = useDebouncedValue(search, 300);

  const categoriesQuery = useCategoriesQuery();
  const opportunitiesQuery = useOpportunitiesQuery({
    isSuggestedTab,
    search: debouncedSearch,
    categoryId: activeCategoryId,
    user,
  });

  const categories = categoriesQuery.data ?? [];
  const opportunities = opportunitiesQuery.data;
  const visibleOpportunities = useMemo(
    () =>
      Array.isArray(opportunities)
        ? opportunities.filter((opportunity) => opportunity.status !== OPPORTUNITY_STATUS.COMPLETED)
        : [],
    [opportunities],
  );

  // isPending = ما في أي بيانات لسا (أول تحميل فعلي لهالفلتر بالذات) —
  // بيختلف عن isFetching اللي بيصير true حتى أثناء إعادة الجلب بالخلفية
  // (لما نغيّر فلتر ولسا عنا نتيجة سابقة ظاهرة بفضل placeholderData)
  const isInitialLoading = opportunitiesQuery.isPending;
  const isRefetching = opportunitiesQuery.isFetching && !isInitialLoading;
  const error = opportunitiesQuery.isError
    ? opportunitiesQuery.error?.message || "Failed to load opportunities"
    : "";

  const resultsLabel = useMemo(() => {
    const count = visibleOpportunities.length;
    return `${count} opportunit${count === 1 ? "y" : "ies"} found`;
  }, [visibleOpportunities.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Typography variant="sectionTitle" className="mb-2">
        Volunteering Opportunities
      </Typography>
      <Typography variant="body" className="mb-8 text-body">
        Find a cause that matches your skills and availability.
      </Typography>

      {isVolunteer ? (
        <OpportunityTabs activeTab={activeTab} onChange={setActiveTab} />
      ) : null}

      <div className="flex flex-col lg:flex-row gap-8">
        {!isSuggestedTab ? (
          <CategorySidebar
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
            searchValue={search}
            onSearchChange={setSearch}
          />
        ) : null}

        <div className={`flex-1 ${isSuggestedTab ? "max-w-5xl mx-auto w-full" : ""}`}>
          {!isInitialLoading ? (
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <p className="text-sm text-heading/50 flex items-center gap-2">
                {resultsLabel}
                {/* مؤشر خفيف أثناء إعادة الجلب بالخلفية (تغيير فلتر/بحث)،
                    بدون ما نخفي النتائج الحالية أو نعرض سكيلتون كامل */}
                {isRefetching ? (
                  <Loader2 size={14} className="animate-spin text-heading/30" aria-hidden="true" />
                ) : null}
              </p>
            </div>
          ) : null}

          {isSuggestedTab ? (
            <div className="flex items-start gap-3 rounded-3xl bg-primary/5 border border-primary/15 p-4 mb-6">
              <Sparkles size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-heading/70">
                Picked for you based on your category, skills, location, and age — this list
                updates automatically as your profile changes.
              </p>
            </div>
          ) : null}

          {isInitialLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-danger">{error}</p>
          ) : visibleOpportunities.length === 0 ? (
            <EmptyState
              icon={isSuggestedTab ? Sparkles : SearchX}
              title={isSuggestedTab ? "No recommended opportunities yet" : "No opportunities found"}
              description={
                isSuggestedTab
                  ? "Update your profile details to get better matches."
                  : "Try a different search term or category."
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity">
              {visibleOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  recommended={isSuggestedTab}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}