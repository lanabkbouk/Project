import { Link } from "react-router-dom";
import { ImageOff } from "lucide-react";
import { ROUTES } from "../../constants/paths";

export default function SimilarOpportunities({ opportunities }) {
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <div className="rounded-3xl bg-heading/5 border border-heading/10 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-heading/60 mb-3">
        Similar Opportunities
      </h3>

      <ul className="flex flex-col gap-3">
        {opportunities.map((item) => (
          <li key={item.id}>
            <Link
              to={`${ROUTES.OPPORTUNITIES}/${item.id}`}
              className="flex items-center gap-3 group"
            >
              <div className="w-14 h-14 shrink-0 rounded-xl bg-heading/10 overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageOff size={18} className="text-heading/30" aria-hidden="true" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-heading truncate group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <span className="text-xs text-primary">View Details</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}