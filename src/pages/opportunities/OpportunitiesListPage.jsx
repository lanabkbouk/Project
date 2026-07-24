import { useEffect, useMemo, useState } from "react";
import Typography from "../../components/ui/Typography";
import OpportunityCard from "../../components/opportunity/OpportunityCard";
import CategorySidebar from "../../components/opportunity/CategorySidebar";
import { fetchCategories } from "../../services/categories";
import { fetchOpportunities } from "../../services/opportunities";
import { useAuth } from "../../context/AuthContext";
import { ACCOUNT_TYPES } from "../../constants/auth/accountTypes";

export default function OpportunitiesListPage() {
  const { isAuthenticated, accountType, user } = useAuth();
  const isVolunteer = isAuthenticated && accountType === ACCOUNT_TYPES.VOLUNTEER;
  const volunteerSkillIds = Array.isArray(user?.skillIds) ? user.skillIds : [];

  const [categories, setCategories] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [matchMySkillsOnly, setMatchMySkillsOnly] = useState(false);

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
    setLoading(true);

    async function loadOpportunities() {
      try {
        const data = await fetchOpportunities({ search, categoryId: activeCategoryId });
        if (isMounted) setOpportunities(data);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load opportunities");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const debounce = setTimeout(loadOpportunities, 300);
    return () => {
      isMounted = false;
      clearTimeout(debounce);
    };
  }, [search, activeCategoryId]);

  const visibleOpportunities = useMemo(() => {
    if (!isVolunteer || !matchMySkillsOnly || volunteerSkillIds.length === 0) {
      return opportunities;
    }

    return opportunities.filter((opportunity) =>
      opportunity.skills.some((skill) => volunteerSkillIds.includes(skill.id)),
    );
  }, [opportunities, isVolunteer, matchMySkillsOnly, volunteerSkillIds]);

  const resultsLabel = useMemo(() => {
    if (loading) return "Loading opportunities...";
    const count = visibleOpportunities.length;
    return `${count} opportunit${count === 1 ? "y" : "ies"} found`;
  }, [loading, visibleOpportunities.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Typography variant="sectionTitle" className="mb-2">
        Volunteering Opportunities
      </Typography>
      <Typography variant="body" className="mb-8 text-body">
        Find a cause that matches your skills and availability.
      </Typography>

      <div className="flex flex-col lg:flex-row gap-8">
        <CategorySidebar
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
          searchValue={search}
          onSearchChange={setSearch}
        />

        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <p className="text-sm text-heading/50">{resultsLabel}</p>

            {isVolunteer ? (
              <label className="flex items-center gap-2 text-sm text-heading cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={matchMySkillsOnly}
                  onChange={(event) => setMatchMySkillsOnly(event.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                Match my skills only
              </label>
            ) : null}
          </div>

          {error ? (
            <p className="text-sm text-danger">{error}</p>
          ) : !loading && visibleOpportunities.length === 0 ? (
            <p className="text-sm text-heading/50">
              No opportunities match your filters. Try a different search or category.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {visibleOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}