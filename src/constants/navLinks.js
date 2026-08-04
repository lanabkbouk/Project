import { ROUTES } from './paths'

export const linksByRole = {
  volunteer: [
    { name: 'Explore Opportunities', href: ROUTES.EXPLORE },
    { name: 'My Volunteering', href: ROUTES.MY_VOLUNTEERING },
    { name: 'Organizations', href: ROUTES.ORGANIZATIONS },
  ],

  organization: [
    { name: 'Dashboard', href: ROUTES.DASHBOARD },
    { name: 'My Causes', href: ROUTES.MY_CAUSES },
  ],

  // ⚠️ عمدًا بدون روابط هون: كل تنقّل الأدمن (Dashboard/Organization
  // Verification/Categories) موجود أصلًا بـ AdminSidebar.jsx على يسار
  // شاشات الأدمن — تكرارها هون كان يعرض نفس الروابط مرتين بمكانين
  // مختلفين بنفس الشاشة. Navbar.jsx بيتعامل مع هالحالة بشكل خاص
  // (رابط "View site" وحيد بدل قائمة كاملة) — راجع isAdmin هناك.
  admin: [],

  guest: [
    { name: 'Opportunities', href: ROUTES.OPPORTUNITIES },
    { name: 'Organizations', href: ROUTES.ORGANIZATIONS },
  ],
}