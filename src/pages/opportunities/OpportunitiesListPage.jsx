import { useEffect, useMemo, useState } from "react";
import { Sparkles, SearchX } from "lucide-react";
import Typography from "../../components/ui/Typography";
import OpportunityCard from "../../components/opportunity/OpportunityCard";
import CategorySidebar from "../../components/opportunity/CategorySidebar";
import OpportunityTabs, { OPPORTUNITY_TABS } from "../../components/opportunity/OpportunityTabs";
import CardSkeleton from "../../components/ui/CardSkeleton";
import EmptyState from "../../components/common/EmptyState";
import { fetchCategories } from "../../services/categories";
import { fetchOpportunities, fetchSuggestedOpportunities } from "../../services/opportunities";
import { useAuth } from "../../context/AuthContext";
import { ACCOUNT_TYPES } from "../../constants/auth/accountTypes";
import { calculateAge } from "../../utils/validators";

export default function OpportunitiesListPage() {
  const { isAuthenticated, accountType, user } = useAuth();
  const isVolunteer = isAuthenticated && accountType === ACCOUNT_TYPES.VOLUNTEER;

  const [categories, setCategories] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  // التبويب متاح بس للمتطوعين — الزائر والمنظمة بيشوفوا "كل الفرص" دايمًا
  const [activeTab, setActiveTab] = useState(OPPORTUNITY_TABS.ALL);
  const isSuggestedTab = isVolunteer && activeTab === OPPORTUNITY_TABS.SUGGESTED;

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const data = await fetchCategories();
        if (isMounted) setCategories(data);
      } catch {
        // categories are a non-critical filter aid; fail silently
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadOpportunities() {
      setLoading(true);
      setError("");

      try {
        const data = isSuggestedTab
          ? await fetchSuggestedOpportunities({
              skillIds: Array.isArray(user?.skillIds) ? user.skillIds : [],
              age: calculateAge(user?.dateOfBirth),
              city: user?.city || "",
            })
          : await fetchOpportunities({ search, categoryId: activeCategoryId });

        if (isMounted) setOpportunities(data);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load opportunities");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // التبويب المقترح ما بيعتمد على البحث/الفئة، فما في داعي نأخر جلبه
    const debounce = setTimeout(loadOpportunities, isSuggestedTab ? 0 : 300);
    return () => {
      isMounted = false;
      clearTimeout(debounce);
    };
  }, [search, activeCategoryId, isSuggestedTab, user]);

  const resultsLabel = useMemo(() => {
    const count = opportunities.length;
    return `${count} opportunit${count === 1 ? "y" : "ies"} found`;
  }, [opportunities.length]);

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
          {!loading ? (
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <p className="text-sm text-heading/50">{resultsLabel}</p>
            </div>
          ) : null}

          {isSuggestedTab ? (
            <div className="flex items-start gap-3 rounded-3xl bg-primary/5 border border-primary/15 p-4 mb-6">
              <Sparkles size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-heading/70">
                Picked for you based on your skills and location — this list updates
                automatically as your profile changes.
              </p>
            </div>
          ) : null}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-danger">{error}</p>
          ) : opportunities.length === 0 ? (
            <EmptyState
              icon={isSuggestedTab ? Sparkles : SearchX}
              title={isSuggestedTab ? "No suggested opportunities yet" : "No opportunities found"}
              description={
                isSuggestedTab
                  ? "Add more skills to your profile to get better matches."
                  : "Try a different search term or category."
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {opportunities.map((opportunity) => (
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