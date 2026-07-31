// utils/auth/profileCompletion.js
//
// نقطة واحدة لتحديد هل بروفايل المتطوع "مكتمل" أو لأ. الاعتماد هون
// على علم صريح واحد (profileCompleted) بيتفعل بس لما ينجح الحفظ
// فعليًا من صفحة البروفايل — مو على فحص كل حقل حقل هون.
//
// السبب: زر الحفظ نفسه مسؤول عن التحقق من الحقول (عبر Zod schema
// جوا react-hook-form)، فـ onSubmit أصلًا ما بينفّذ إذا في حقل ناقص.
// يعني نجاح الحفظ = دليل كافي إنو كل الحقول الإجبارية كانت موجودة،
// وما في داعي نكرر نفس التحقق هون مرة تانية.

export function isVolunteerProfileComplete(user) {
  return Boolean(user?.profileCompleted)
}