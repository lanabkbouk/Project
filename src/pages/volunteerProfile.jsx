import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSkillsQuery } from "../hooks/queries/useSkillsQuery";
import { useUpdateVolunteerProfileMutation } from "../hooks/queries/useUpdateVolunteerProfileMutation";
import { useImageUpload } from "../hooks/useImageUpload";
import { PANEL_SURFACE } from "../utils/surfaceStyles";

import ProfileHeader from "../components/volunteerProfile/ProfileHeader";
import ProfileForm from "../components/volunteerProfile/ProfileForm";
import ProfilePreview from "../components/volunteerProfile/ProfilePreview";
import AchievementsList from "../components/volunteerProfile/AchievementsList";
import Typography from "../components/ui/Typography";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Toast from "../components/common/Toast";
import useUnsavedChangesGuard from "../hooks/useUnsavedChangesGuard";
import { profileSchema } from "../utils/auth/VolunteerProfileValidation";

const normalizeGenderFromUser = (gender) => {
  if (!gender) return "";
  const g = String(gender).toLowerCase();
  if (g === "female" || g === "f") return "Female";
  if (g === "male" || g === "m") return "Male";
  if (g.includes("prefer") || g.includes("not")) return "Prefer not to say";
  return gender;
};

export default function VolunteerProfile() {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const guardMessage = location.state?.message || '';

  // نفس هوك المهارات مستخدم هون وبـ ProfilePreview سوا — بفضل الكاش
  // المشترك ما بتنجلب مرتين حتى لو الاثنين رندروا بنفس اللحظة
  const skillsQuery = useSkillsQuery();
  const availableSkills = skillsQuery.data ?? [];
  const skillsLoading = skillsQuery.isPending;

  const updateProfileMutation = useUpdateVolunteerProfileMutation();

  // useImageUpload يتكفّل بالمعاينة المحلية والتحقق من نوع/حجم الصورة —
  // نفس الـ hook المستخدم بصفحة Register وorgForm، بدل FileReader يدوي
  // مكرر هون لحاله. user متوفر فورًا من AuthContext (بعكس orgProfile
  // يلي بينتظر React Query)، فمنقدر نمرر قيمة أولية مباشرة
  const imageUpload = useImageUpload(user?.imageUrl || "");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [profileNotice, setProfileNotice] = useState(guardMessage);

  const defaultValues = useMemo(
    () => ({
      educationLevel: user?.educationLevel || "",
      dateOfBirth: user?.dateOfBirth || user?.dob || "",
      gender: normalizeGenderFromUser(user?.gender),
      city: user?.city || "",
      skills: Array.isArray(user?.skillIds) ? user?.skillIds : [],
      interests: Array.isArray(user?.interests)
        ? user?.interests.join(", ")
        : user?.interests || "",
      about: user?.about || user?.bio || "",
    }),
    [user]
  );

  const methods = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onSubmit",
  });

  // نحجز التنقّل بس لما فيه تعديلات فعلية غير محفوظة، وما نحجزه أثناء
  // عملية الحفظ نفسها (submitting) حتى ما يعلق المستخدم بمنتصف الحفظ
  const unsavedChangesBlocker = useUnsavedChangesGuard(
    methods.formState.isDirty && !updateProfileMutation.isPending
  );

  const fullName = user?.displayName;

  const onSubmit = async (data) => {
    setSubmitError("");
    setSuccessMessage("");

    try {
      const result = await updateProfileMutation.mutateAsync({ values: data, photoFile: imageUpload.file });

      if (!result.success) {
        setSubmitError(result.error || "Failed to save profile");
        return;
      }

      setSuccessMessage("Profile saved successfully.");

      // نصفّر حالة "isDirty" بعد نجاح الحفظ — وإلا حارس التنقّل الجديد
      // (useUnsavedChangesGuard) رح يضل يحذّر المستخدم حتى بعد ما حفظ فعليًا
      methods.reset(data);

      // بيتفعّل بس هون: نجاح استدعاء الحفظ دليل كافي إنو Zod schema
      // (جوا ProfileForm) قبلت كل الحقول الإجبارية، فما في داعي نعيد
      // فحصها. هاد العلم هو يلي بيقرأه RequireCompleteProfile لاحقًا.
      updateUser({
        ...data,
        skillIds: data.skills,
        imageUrl: result.data?.imageUrl || imageUpload.previewUrl,
        profileCompleted: true,
      });
    } catch (err) {
      setSubmitError(err.message || "Failed to save profile");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto w-full flex-1 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="container mx-auto px-4 md:px-16 py-10 md:py-14">
          <ProfileHeader
            fullName={fullName}
            gender={methods.watch("gender")}
            imagePreview={imageUpload.previewUrl}
            onImageChange={imageUpload.handleFileChange}
          />

          {imageUpload.error && (
            <p className="mt-2 text-sm text-danger">{imageUpload.error}</p>
          )}

          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className={`lg:col-span-2 ${PANEL_SURFACE} p-6 md:p-8`}>
              <ProfileForm
                submitting={updateProfileMutation.isPending}
                availableSkills={availableSkills}
                skillsLoading={skillsLoading}
              />
              {submitError && (
                <p className="mt-4 rounded-lg border border-danger bg-danger/5 px-3 py-2 text-sm text-danger">
                  {submitError}
                </p>
              )}

              {successMessage && (
                <p className="mt-4 rounded-lg border border-green-600 bg-green-50 px-3 py-2 text-sm text-green-700">
                  {successMessage}
                </p>
              )}
            </div>

            {/*  رير المهارات للـ Preview */}
            <ProfilePreview
              fullName={fullName}
              email={user?.email}
              phone={user?.phone}
              availableSkills={availableSkills}
            />
          </form>

          <section className={`mt-8 ${PANEL_SURFACE} p-6 md:p-8`}>
            <Typography variant="h4" gutterBottom>
              Achievements
            </Typography>
            <AchievementsList />
          </section>
        </div>
      </div>

      {/* نافذة تأكيد المغادرة — تظهر بس لما فيه تعديلات غير محفوظة
          والمتطوع حاول ينتقل لصفحة تانية (رابط أو زر رجوع المتصفح) */}
      <Modal
        open={unsavedChangesBlocker.state === "blocked"}
        onClose={() => unsavedChangesBlocker.reset?.()}
        title="Unsaved changes"
        footer={
          <>
            <Button variant="ghost" onClick={() => unsavedChangesBlocker.reset?.()}>
              Stay on this page
            </Button>
            <Button variant="danger" onClick={() => unsavedChangesBlocker.proceed?.()}>
              Leave without saving
            </Button>
          </>
        }
      >
        You have unsaved changes to your profile. If you leave now, these changes will be lost.
      </Modal>

      <Toast
        message={profileNotice}
        variant="info"
        duration={7000}
        onClose={() => setProfileNotice('')}
      />
    </FormProvider>
  );
}