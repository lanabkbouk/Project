// غلاف رقيق فوق components/ui/Tabs.jsx العام — نفس نمط
// OpportunityTabs.jsx بالضبط، بس لتبويبات حالة "My Volunteering".

import { LayoutGrid, Clock, CheckCircle2, PlayCircle, Award, XCircle, LogOut } from "lucide-react";
import Tabs from "../ui/Tabs";
import { PARTICIPATION_DISPLAY_STATUS } from "../../utils/participationDisplayStatus";

export const PARTICIPATION_TAB = { ALL: "all", ...PARTICIPATION_DISPLAY_STATUS };

const TAB_DEFS = [
  { id: PARTICIPATION_TAB.ALL, label: "All", icon: LayoutGrid },
  { id: PARTICIPATION_DISPLAY_STATUS.PENDING, label: "Pending", icon: Clock },
  { id: PARTICIPATION_DISPLAY_STATUS.ACCEPTED, label: "Accepted", icon: CheckCircle2 },
  { id: PARTICIPATION_DISPLAY_STATUS.ACTIVE, label: "Active", icon: PlayCircle },
  { id: PARTICIPATION_DISPLAY_STATUS.COMPLETED, label: "Completed", icon: Award },
  { id: PARTICIPATION_DISPLAY_STATUS.REJECTED, label: "Rejected", icon: XCircle },
  { id: PARTICIPATION_DISPLAY_STATUS.WITHDRAWN, label: "Withdrawn", icon: LogOut },
];

/**
 * @param {string} activeTab
 * @param {(tabId:string)=>void} onChange
 * @param {object} counts - راجع useParticipationCounts؛ تبويب Pending
 *   بيضم عدّاد Expired كمان (راجع matchesParticipationStatusTab لنفس القرار)
 */
export default function ParticipationStatusTabs({ activeTab, onChange, counts = {} }) {
  const tabs = TAB_DEFS.map((tab) => ({
    ...tab,
    count:
      tab.id === PARTICIPATION_DISPLAY_STATUS.PENDING
        ? (counts.pending || 0) + (counts.expired || 0)
        : counts[tab.id],
  }));

  return <Tabs tabs={tabs} activeTab={activeTab} onChange={onChange} ariaLabel="My volunteering status filter" />;
}
