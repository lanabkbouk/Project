// services/skills.js
//
// Matches the "skill" table in the ERD: skill_id, name.
// Each skill carries a "categoryId" from the shared category table.
// This lets the Volunteer Profile group skills by category and lets
// Opportunities match required skills.
//
// TODO: once Laravel is ready, set VITE_USE_MOCK_CATALOG=false
// GET /api/skills -> [{ id, name, categoryId }, ...]

import { apiClient, getApiErrorMessage } from "./api/client";
import { fetchCategories } from "./categories"; // ← مهم جداً

const MOCK_MODE = (import.meta.env.VITE_USE_MOCK_CATALOG || "true") === "true";

const MOCK_SKILLS = [
  // Health (c1)
  { id: "s1", name: "First Aid", categoryId: "c1" },
  { id: "s2", name: "Patient Care", categoryId: "c1" },
  { id: "s3", name: "Health Awareness", categoryId: "c1" },

  // Education (c2)
  { id: "s4", name: "Teaching", categoryId: "c2" },
  { id: "s5", name: "Tutoring", categoryId: "c2" },
  { id: "s6", name: "Curriculum Design", categoryId: "c2" },

  // Social (c3)
  { id: "s7", name: "Communication", categoryId: "c3" },
  { id: "s8", name: "Event Management", categoryId: "c3" },
  { id: "s9", name: "Fundraising", categoryId: "c3" },

  // Sport (c4)
  { id: "s10", name: "Coaching", categoryId: "c4" },
  { id: "s11", name: "Team Leadership", categoryId: "c4" },

  // Environment (c5)
  { id: "s12", name: "Environmental Awareness", categoryId: "c5" },
  { id: "s13", name: "Waste Management", categoryId: "c5" },

  // Technical (c6)
  { id: "s14", name: "Programming", categoryId: "c6" },
  { id: "s15", name: "Graphic Design", categoryId: "c6" },
  { id: "s16", name: "Photography", categoryId: "c6" },
];

function wait(duration = 250) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Fetches all available skills and attaches category info dynamically.
 */
export async function fetchAvailableSkills() {
  const categories = await fetchCategories(); // ← جلب التصنيفات

  let skills = [];

  if (MOCK_MODE) {
    await wait();
    skills = MOCK_SKILLS;
  } else {
    try {
      const response = await apiClient.get("/skills");
      skills = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Failed to load skills"));
    }
  }

  // 🔥 الربط الديناميكي هنا
  return skills.map((skill) => ({
    ...skill,
    category: categories.find((c) => c.id === skill.categoryId) || null,
  }));
}

/**
 * Fetches skills belonging to a specific category only.
 */
export async function fetchSkillsByCategory(categoryId) {
  const skills = await fetchAvailableSkills();
  if (!categoryId) return skills;
  return skills.filter((skill) => skill.categoryId === categoryId);
}
