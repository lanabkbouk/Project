// src/utils/achievementStyles.js
//
// خريطة ألوان/أيقونات الإنجازات — نفس نمط categoryStyles.js بالمشروع.
// المطابقة تتم عبر كلمات مفتاحية بالاسم (مو id) عشان تبقى تشتغل صح
// حتى لو تغيّرت الـ ids الحقيقية القادمة من Laravel لاحقًا.
// أي إنجاز جديد غير معروف بياخد نمط افتراضي (Default) تلقائيًا.

import { Flag, Flame, Users, Award } from "lucide-react";

const ACHIEVEMENT_STYLES = [
  {
    match: (name) => name.toLowerCase().includes("first"),
    icon: Flag,
    colorClasses: "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600",
  },
  {
    match: (name) => name.toLowerCase().includes("hour"),
    icon: Flame,
    colorClasses: "bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600",
  },
  {
    match: (name) => name.toLowerCase().includes("group"),
    icon: Users,
    colorClasses: "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600",
  },
];

const DEFAULT_STYLE = {
  icon: Award,
  colorClasses: "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600",
};

export function getAchievementStyle(name = "") {
  const found = ACHIEVEMENT_STYLES.find((style) => style.match(name));
  return found || DEFAULT_STYLE;
}