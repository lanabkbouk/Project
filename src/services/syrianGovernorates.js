// src/services/syrianGovernorates.js

/**
 * قائمة المحافظات السورية (بيانات ثابتة - Mock Data)
 * ----------------------------------------------------
 * بيانات تجريبية ثابتة لحين ربط المشروع بالـ Laravel API فعليًا.
 * البنية مصممة لتطابق الشكل المتوقع من الباك اند مستقبلًا (id, nameAr, nameEn, slug)
 * بحيث عند استبدال هذا الملف باستدعاء API حقيقي (fetch/axios لهذا الملف نفسه)
 * لا تحتاج أي Component لتغيير طريقة التعامل مع البيانات.
 *
 * id     : المعرف الفعلي الذي يُرسل/يُستقبل من الباك اند (Foreign Key لاحقًا)
 * nameAr : اسم المحافظة بالعربية (لعرضها في الواجهة)
 * nameEn : اسم المحافظة بالإنجليزية (يُستخدم حاليًا كقيمة حقل "city")
 * slug   : معرف نصي مختصر (مفيد للروابط أو الفلترة في الـ URL)
 */
export const syrianGovernorates = [
  { id: 1, nameAr: "دمشق", nameEn: "Damascus", slug: "damascus" },
  { id: 2, nameAr: "ريف دمشق", nameEn: "Rural Damascus", slug: "rural-damascus" },
  { id: 3, nameAr: "حلب", nameEn: "Aleppo", slug: "aleppo" },
  { id: 4, nameAr: "حمص", nameEn: "Homs", slug: "homs" },
  { id: 5, nameAr: "حماة", nameEn: "Hama", slug: "hama" },
  { id: 6, nameAr: "اللاذقية", nameEn: "Latakia", slug: "latakia" },
  { id: 7, nameAr: "طرطوس", nameEn: "Tartus", slug: "tartus" },
  { id: 8, nameAr: "إدلب", nameEn: "Idlib", slug: "idlib" },
  { id: 9, nameAr: "درعا", nameEn: "Daraa", slug: "daraa" },
  { id: 10, nameAr: "السويداء", nameEn: "As-Suwayda", slug: "as-suwayda" },
  { id: 11, nameAr: "القنيطرة", nameEn: "Quneitra", slug: "quneitra" },
  { id: 12, nameAr: "دير الزور", nameEn: "Deir ez-Zor", slug: "deir-ez-zor" },
  { id: 13, nameAr: "الرقة", nameEn: "Raqqa", slug: "raqqa" },
  { id: 14, nameAr: "الحسكة", nameEn: "Al-Hasakah", slug: "al-hasakah" },
];

/**
 * Alias بأحرف كبيرة للتوافق مع الـ Components التي تستورد بهذا الاسم
 * (مثل ProfileForm.jsx و ProfileHeader.jsx). نفس المرجع، بدون تكرار البيانات.
 */
export const SYRIAN_GOVERNORATES = syrianGovernorates;

/** عدد المحافظات السورية */
export const SYRIAN_GOVERNORATES_COUNT = syrianGovernorates.length;

/**
 * دالة مساعدة لجلب محافظة عبر الـ id
 * @param {number} id
 * @returns {object|undefined}
 */
export const getGovernorateById = (id) =>
  syrianGovernorates.find((governorate) => governorate.id === id);

/**
 * دالة مساعدة لجلب محافظة عبر الاسم الإنجليزي (nameEn)
 * مفيدة عند التعامل مع حقل "city" الذي يخزّن نصًا إنجليزيًا وليس id
 * @param {string} nameEn
 * @returns {object|undefined}
 */
export const getGovernorateByNameEn = (nameEn) =>
  syrianGovernorates.find((governorate) => governorate.nameEn === nameEn);

/**
 * تحويل القائمة إلى شكل عناصر Dropdown/Select
 * (value = id, label = الاسم بالعربية)
 */
export const getGovernorateOptions = () =>
  syrianGovernorates.map(({ id, nameAr }) => ({
    value: id,
    label: nameAr,
  }));

export default syrianGovernorates;