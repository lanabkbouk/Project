// جرس إشعارات مستقل بالنافبار — بديل عن دفن التحديثات جوا Dropdown
// البروفايل (كان لازم تضغطي اسمك أول لتكتشفي وجودهم). نفس فلسفة
// useClickOutside الموجودة أصلًا (StatusLegendPopover)، بس بعداد رقمي
// وأيقونة مختلفة لكل نوع تحديث — بدل نقطة حمراء صامتة أو نص فاضي.

import { Link } from "react-router-dom";
import { Bell, Trophy, Clock3, CalendarClock, CheckCircle2, XCircle, PartyPopper, LogOut } from "lucide-react";
import useClickOutside from "../../hooks/useClickOutside";

const TYPE_ICONS = {
  achievement: Trophy,
  hours: Clock3,
  "status-accepted": CheckCircle2,
  "status-rejected": XCircle,
  "org-verified": CheckCircle2,
  "org-rejected": XCircle,
  "applicant-withdrawn": LogOut,
  "opportunity-reminder": CalendarClock,
};

const TYPE_ICON_COLORS = {
  achievement: "text-amber-500",
  hours: "text-primary",
  "status-accepted": "text-emerald-500",
  "status-rejected": "text-red-500",
  "org-verified": "text-emerald-500",
  "org-rejected": "text-red-500",
  "applicant-withdrawn": "text-heading/50",
  "opportunity-reminder": "text-sky-500",
};

export default function NotificationBell({ items, isOpen, onToggle, onClose, triggerClassName }) {
  const rootRef = useClickOutside(isOpen, onClose);
  const count = items.length;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={count > 0 ? `${count} new updates` : "Notifications"}
        className={
          triggerClassName ||
          "relative flex items-center justify-center h-10 w-10 rounded-2xl bg-white/10 border border-white/15 text-white hover:bg-white/15 hover:border-white/25 transition"
        }
      >
        <Bell className="h-4.5 w-4.5" aria-hidden="true" />
        {count > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[11px] font-bold leading-[18px] text-center border-2 border-black animate-pulse"
            aria-hidden="true"
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-2xl bg-field border-2 border-heading/20 shadow-2xl ring-1 ring-black/5 overflow-hidden z-50">
          <p className="px-4 py-3 text-xs font-semibold text-heading/50 uppercase tracking-wide border-b border-heading/10">
            Notifications
          </p>

          {count === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <PartyPopper size={22} className="text-heading/30" aria-hidden="true" />
              <p className="text-sm text-heading/50">You're all caught up.</p>
            </div>
          ) : (
            <div className="flex flex-col max-h-80 overflow-y-auto">
              {items.map((update) => {
                const Icon = TYPE_ICONS[update.type] || Bell;
                const iconColor = TYPE_ICON_COLORS[update.type] || "text-primary";
                return (
                  <Link
                    key={update.id}
                    to={update.href}
                    onClick={onClose}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-heading/5 transition border-b border-heading/5 last:border-b-0"
                  >
                    <span
                      className={`shrink-0 mt-0.5 h-8 w-8 rounded-full bg-heading/5 flex items-center justify-center ${iconColor}`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <p className="text-sm font-medium text-heading">{update.title}</p>
                      <p className="text-xs text-heading/50 truncate">{update.description}</p>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}