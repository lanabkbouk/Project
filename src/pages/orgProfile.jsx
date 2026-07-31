import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../context/AuthContext";
import { fetchOrganizationProfile, updateOrganizationProfile } from "../services/organization";
import { organizationProfileSchema } from "../utils/auth/OrganizationProfileValidation";
import { ORGANIZATION_STATUS } from "../constants/organizationStatus";
import { PANEL_SURFACE } from "../utils/surfaceStyles";

import OrgProfileHeader from "../components/OrgProfile/ProfileHeader";
import OrgProfileForm from "../components/OrgProfile/ProfileForm";
import OrgProfilePreview from "../components/OrgProfile/ProfilePreview";
import VerificationStatusBanner from "../components/OrgProfile/VerificationStatusBanner";
import Skeleton from "../components/ui/Skeleton";

export default function OrgProfile() {
  const { user, updateUser } = useAuth();

  const [organization, setOrganization] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const methods = useForm({
    resolver: zodResolver(organizationProfileSchema),
    defaultValues: { name: "", description: "", city: "", website: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    fetchOrganizationProfile().then((result) => {
      if (result.success) {
        setOrganization(result.data);
        setImagePreview(result.data.imageUrl || "");

        methods.reset({
          name: result.data.name || "",
          description: result.data.description || "",
          city: result.data.city || "",
          website: result.data.website || "",
        });
      }

      setIsLoading(false);
    });
  }, []);

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageFile(file);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      if (imageFile) formData.append("logo", imageFile);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("city", data.city);
      formData.append("website", data.website || "");

      const result = await updateOrganizationProfile(formData);

      if (!result.success) {
        setSubmitError(result.error || "Failed to save changes");
        return;
      }

      updateUser({ ...user, ...data });
      // نحدّث حالة المنظمة المحلية فعليًا بعد نجاح الحفظ — وإلا رأس
      // الصفحة (الاسم، الشارة) يضل عارض البيانات القديمة للأبد بنفس
      // الجلسة، رغم إنه الحفظ نجح فعليًا بالتخزين
      setOrganization((current) => ({ ...current, ...data }));
      methods.reset(data);
      setSuccessMessage("Changes saved successfully.");
    } catch (err) {
      setSubmitError(err.message || "Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  };

  const canUseServices = organization?.status === ORGANIZATION_STATUS.VERIFIED;

  if (isLoading) {
    return (
      <div className="mx-auto w-full flex-1 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="container mx-auto px-4 md:px-16 py-10 md:py-14">
          {/* هيكل تقريبي لرأس البروفايل: صورة دائرية + اسم + شارة حالة */}
          <div className={`flex flex-col md:flex-row md:items-center gap-8 ${PANEL_SURFACE} px-8 py-10`}>
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-xl" />
              <div className="flex flex-col gap-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
          </div>

          {/* هيكل تقريبي للنموذج + بطاقة المعاينة */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 ${PANEL_SURFACE} p-6 md:p-8 flex flex-col gap-5`}>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className={`${PANEL_SURFACE} p-6 md:p-8 flex flex-col items-center gap-4`}>
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="mx-auto w-full flex-1 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="container mx-auto px-4 md:px-16 py-10 md:py-14">

          <VerificationStatusBanner
            status={organization?.status}
            rejectionReason={organization?.rejectionReason}
          />

          <OrgProfileHeader
            name={organization?.name}
            imagePreview={imagePreview}
            onImageChange={onImageChange}
            status={organization?.status}
          />

          {/* FORM + PREVIEW */}
          <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
            {/* LEFT: FORM */}
            <div className={`lg:col-span-2 ${PANEL_SURFACE} p-6 md:p-8`}>
              <OrgProfileForm submitting={submitting} />
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

            {/* RIGHT: PREVIEW */}
            <OrgProfilePreview email={organization?.email} />
          </form>

          {!canUseServices && (
            <p className="mt-4 text-xs text-body text-center">
              Opportunity posting will be available once your organization is verified.
            </p>
          )}
        </div>
      </div>
    </FormProvider>
  );
}