
// عمود واحد (متطوع أو منظمة) بسكشن "How to Join". فصلته عن السكشن
// نفسه لأن العمودين متطابقان بالبنية تمامًا وبيختلفوا بس بالمحتوى —
// بدل تكرار نفس الـ JSX مرتين، Component واحد بياخد البيانات كـ props.

import { Link } from "react-router-dom";
import Typography from "../ui/Typography";
import Button from "../ui/Button";

export default function HowToJoinColumn({
  title,
  description,
  steps,
  ctaLabel,
  ctaHref,
  buttonVariant = "primary",
}) {
  return (
    <div className="rounded-3xl border border-heading/10 bg-heading/5 p-8">
      <Typography variant="h3" className="mb-2">
        {title}
      </Typography>
      <Typography variant="body" className="mb-6 text-body">
        {description}
      </Typography>

      <ul className="flex flex-col gap-4 mb-8">
        {steps.map((step, index) => (
          <li key={step.text} className="flex items-start gap-3">
            <span className="w-8 h-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </span>
            <span className="flex items-center gap-2 text-sm text-heading/80 pt-1.5">
              <step.icon size={16} className="text-primary shrink-0" />
              {step.text}
            </span>
          </li>
        ))}
      </ul>

      <Link to={ctaHref}>
        <Button variant={buttonVariant} fullWidth>
          {ctaLabel}
        </Button>
      </Link>
    </div>
  );
}