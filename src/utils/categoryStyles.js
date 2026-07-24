// src/utils/categoryStyles.js

import {
  HeartPulse,
  GraduationCap,
  Users,
  Dumbbell,
  Leaf,
  Cpu
} from "lucide-react";

// -----------------------------
// Category Icons
// -----------------------------
export const CATEGORY_ICONS = {
  Health: HeartPulse,
  Education: GraduationCap,
  Social: Users,
  Sport: Dumbbell,
  Environment: Leaf,
  Technical: Cpu,
};

// -----------------------------
// Category Colors (Preview + Chips)
// -----------------------------
export const CATEGORY_COLORS = {
  Health: "text-red-600 bg-red-100 border-red-200",
  Education: "text-blue-600 bg-blue-100 border-blue-200",
  Social: "text-purple-600 bg-purple-100 border-purple-200",
  Sport: "text-orange-600 bg-orange-100 border-orange-200",
  Environment: "text-green-600 bg-green-100 border-green-200",
  Technical: "text-gray-700 bg-gray-100 border-gray-200",
};

// -----------------------------
// Category Colors when Selected (ProfileForm)
// -----------------------------
export const CATEGORY_SELECTED_COLORS = {
  Health: "bg-red-600 text-white border-red-600",
  Education: "bg-blue-600 text-white border-blue-600",
  Social: "bg-purple-600 text-white border-purple-600",
  Sport: "bg-orange-600 text-white border-orange-600",
  Environment: "bg-green-600 text-white border-green-600",
  Technical: "bg-gray-700 text-white border-gray-700",
};
