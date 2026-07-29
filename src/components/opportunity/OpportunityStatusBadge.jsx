import Chip from "../ui/Chip";
import { OPPORTUNITY_STATUS_META } from "../../constants/opportunityStatus";

export default function OpportunityStatusBadge({ status }) {
  const meta = OPPORTUNITY_STATUS_META[status];

  if (!meta) return null;

  return <Chip color={meta.color}>{meta.label}</Chip>;
}