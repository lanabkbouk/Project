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
 * عدد المحافظات السورية
 * مفيد للصفحات التي تحتاج عرض رقم ثابت بدون حسابه كل مرة
 */
export const SYRIAN_GOVERNORATES_COUNT = syrianGovernorates.length;

/**
 * دالة مساعدة لجلب محافظة عبر الـ id
 * @param {number} id - معرف المحافظة
 * @returns {object|undefined} 
 */
export const getGovernorateById = (id) =>
  syrianGovernorates.find((governorate) => governorate.id === id);

/**
 * دالة مساعدة لتحويل القائمة إلى الشكل المتوقع من مكونات الـ Select
 * (value = id, label = الاسم بالعربية)
 */
export const getGovernorateOptions = () =>
  syrianGovernorates.map(({ id, nameAr }) => ({
    value: id,
    label: nameAr,
  }));

export default syrianGovernorates;
