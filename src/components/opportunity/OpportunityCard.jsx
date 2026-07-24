import { MapPin, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Chip from "../ui/Chip";
import Button from "../ui/Button";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../../utils/categoryStyles";
import { ROUTES } from "../../constants/paths";

export default function OpportunityCard({ opportunity }) {
  const navigate = useNavigate();
  const categoryName = opportunity.category?.name;
  const categoryStyle = CATEGORY_COLORS[categoryName] || CATEGORY_COLORS.Social;
  const CategoryIcon = CATEGORY_ICONS[categoryName] || Users;
  const spotsLeft = Math.max(opportunity.maxVolunteers - opportunity.currentVolunteers, 0);

  // Falls back to a category-colored icon whenever there's no real photo yet —
  // whether the organization hasn't uploaded one, or the backend rejected it.
  // This never depends on the backend "working"; it's always safe to render.
  const imageFallback = (
    <div className={`flex w-full aspect-video items-center justify-center ${categoryStyle}`}>
      <CategoryIcon className="h-10 w-10" aria-hidden="true" />
    </div>
  );

  return (
    <Card
      imageSrc={opportunity.image}
      imageAlt={opportunity.title}
      imageFallback={imageFallback}
      title={opportunity.title}
      description={opportunity.description}
      hideStats
      onAction={() => navigate(`${ROUTES.OPPORTUNITIES}/${opportunity.id}`)}
    >
      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-body">
        <span className="flex items-center gap-1">
          <MapPin size={16} className="text-primary" aria-hidden="true" />
          {opportunity.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={16} className="text-primary" aria-hidden="true" />
          {opportunity.minHours}-{opportunity.maxHours} hrs
        </span>
        <span className="flex items-center gap-1">
          <Users size={16} className="text-primary" aria-hidden="true" />
          {spotsLeft} spots left
        </span>
      </div>

      {opportunity.category ? (
        <Chip customStyle={categoryStyle} className="mb-4 inline-block w-fit">
          {opportunity.category.name}
        </Chip>
      ) : null}

      <Button
        variant="secondary"
        fullWidth
        className="py-4 rounded-4xl text-[15px] font-bold uppercase tracking-wide"
        onClick={() => navigate(`${ROUTES.OPPORTUNITIES}/${opportunity.id}`)}
      >
        View Details
      </Button>
    </Card>
  );
}