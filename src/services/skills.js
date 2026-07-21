// services/skillsService.js
//
// TODO: استبدلي هاد بالـ endpoint الفعلي من الباك إند لما يكون جاهز.
// مثال متوقع: GET /api/skills  → يرجع [{ id, name }, ...]
//
// حالياً بيرجع بيانات وهمية (Mock) حتى تقدري تكملي الواجهة بدون ما تستنّي الباك.

const MOCK_SKILLS = [
  { id: "s1", name: "التواصل" },
  { id: "s2", name: "العمل الجماعي" },
  { id: "s3", name: "الإسعافات الأولية" },
  { id: "s4", name: "التدريس" },
  { id: "s5", name: "التصميم الجرافيكي" },
  { id: "s6", name: "إدارة الفعاليات" },
  { id: "s7", name: "الترجمة" },
  { id: "s8", name: "البرمجة" },
];

export async function fetchAvailableSkills() {
  // محاكاة تأخير الشبكة
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_SKILLS;

  // لما يجهز الباك، استبدلي الكود فوق بـ:
  // const res = await fetch("/api/skills");
  // if (!res.ok) throw new Error("فشل تحميل قائمة المهارات");
  // return res.json();
}