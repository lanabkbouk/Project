// open: لسا مفتوحة لاستقبال متطوعين جدد
// closed: تلقائيًا لما current_volu يوصل max_volu، أو دستيًا من المنظمة
export const OPPORTUNITY_STATUS = {
  OPEN: "open",
  CLOSED: "closed",
};

export const OPPORTUNITY_STATUS_META = {
  [OPPORTUNITY_STATUS.OPEN]: { label: "Open", color: "green" },
  [OPPORTUNITY_STATUS.CLOSED]: { label: "Closed", color: "gray" },
};