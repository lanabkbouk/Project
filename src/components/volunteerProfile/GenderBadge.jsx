import { Mars, Venus, User } from "lucide-react";

const GENDER_CONFIG = {
  Male: { icon: Mars, label: "Male" },
  Female: { icon: Venus, label: "Female" },
  "Prefer not to say": { icon: User, label: "Prefer not to say" },
};

export default function GenderBadge({ gender }) {
  const config = GENDER_CONFIG[gender];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2">
      <Icon size={16} className="text-primary" />
      <span className="text-sm text-heading">{config.label}</span>
    </div>
  );
}