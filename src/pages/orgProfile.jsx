import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../context/AuthContext";
import { fetchOrganizationProfile, updateOrganizationProfile } from "../services/organization";
import { organizationProfileSchema } from "../utils/auth/OrganizationProfileValidation";
import { ORGANIZATION_STATUS } from "../constants/organizationStatus";

import OrgProfileHeader from "../components/orgProfile/ProfileHeader";
import OrgProfileForm from "../components/orgProfile/ProfileForm";
import OrgProfilePreview from "../components/orgProfile/ProfilePreview";
import VerificationStatusBanner from "../components/orgProfile/VerificationStatusBanner";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function OrgProfile() {
  const { user, updateUser } = useAuth();

  const [organization, setOrganization] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
    } catch (err) {
      setSubmitError(err.message || "Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  };

  const canUseServices = organization?.status === ORGANIZATION_STATUS.VERIFIED;

  if (isLoading) {
    return <LoadingSpinner message="Loading organization profile..." fullScreen />;
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
              className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
            >
            {/* LEFT: FORM */}
            <div className="lg:col-span-2 rounded-3xl bg-heading/5 border border-heading/10 p-6 md:p-8 h-full">
              <OrgProfileForm submitting={submitting} />
              {submitError && (
                <p className="mt-4 text-sm text-danger">{submitError}</p>
              )}
            </div>

            {/* RIGHT: PREVIEW */}
            <OrgProfilePreview organization={organization} />
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
