// components/common/ShowMoreButton.jsx
//
// زر "Show more" موحّد الشكل، يُستخدم مع useShowMore. عرضه بيتضمن عدد
// العناصر المتبقية (مش بس "Show more" عارية) حتى يعرف المستخدم قبل
// ما يضغط قديه باقي — تفصيل بسيط بيحسّن الثقة بالتفاعل.

import { ChevronDown } from "lucide-react";
import Button from "../ui/Button";

export default function ShowMoreButton({ remainingCount, onClick }) {
  return (
    <div className="mt-6 flex justify-center">
      <Button variant="ghost" onClick={onClick} className="flex items-center gap-1.5">
        <ChevronDown size={16} aria-hidden="true" />
        Show {remainingCount} more
      </Button>
    </div>
  );
}