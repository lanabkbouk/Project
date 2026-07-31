import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "../components/ui/Typography";
import CauseForm from "../components/organization/CauseForm";
import Skeleton from "../components/ui/Skeleton";
import VerificationStatusBanner from "../components/OrgProfile/VerificationStatusBanner";
import { useOrganizationVerification } from "../hooks/useOrganizationVerification";
import { fetchCategories } from "../services/categories";
import { useImageUpload } from "../hooks/useImageUpload";
import {
  fetchOpportunityById,
  createOpportunity,
  updateOpportunity,
} from "../services/opportunities";
import { opportunitySchema } from "../utils/opportunityValidation";
import { ROUTES } from "../constants/paths";

const DEFAULT_VALUES = {
  title: "",
  description: "",
  categoryId: "",
  city: "",
  startDate: "",
  endDate: "",
  minHours: "",
  maxHours: "",
  maxVolunteers: "",
};

export default function CreateEditCause() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { status, isVerified } = useOrganizationVerification();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    previewUrl: imagePreview,
    error: imageError,
    handleFileChange,
    file: imageFile,
    setPreviewUrl,
  } = useImageUpload();

  const methods = useForm({
    resolver: zodResolver(opportunitySchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const categoryList = await fetchCategories();
        if (!isMounted) return;
        setCategories(categoryList);

        if (isEditMode) {
          const { opportunity } = await fetchOpportunityById(id);
          if (!opportunity || !isMounted) return;

          methods.reset({
            title: opportunity.title,
            description: opportunity.description,
            categoryId: opportunity.category?.id || "",
            city: opportunity.location,
            startDate: opportunity.startDate,
            endDate: opportunity.endDate,
            minHours: opportunity.minHours,
            maxHours: opportunity.maxHours,
            maxVolunteers: opportunity.maxVolunteers,
          });

          if (opportunity.image) setPreviewUrl(opportunity.image);
        }
      } catch (err) {
        if (isMounted) setSubmitError(err.message || "Failed to load form data");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    const selectedCategory = categories.find((category) => category.id === values.categoryId);
    const payload = {
      ...values,
      category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : null,
      location: values.city,
      imageFile,
    };

    const result = isEditMode
      ? await updateOpportunity(id, payload)
      : await createOpportunity(payload);

    if (!result.success) {
      setSubmitting(false);
      setSubmitError(result.error || "Something went wrong");
      return;
    }

    // نعرض تأكيد نجاح واضح للمستخدم قبل ما ننتقل، بدل انتقال صامت فوري
    // ما بيعطي أي إحساس إنه الحفظ صار فعلًا
    setSuccessMessage(isEditMode ? "Changes saved successfully." : "Cause published successfully.");
    setTimeout(() => navigate(ROUTES.MY_CAUSES), 900);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-80 mb-8" />
        <div className="flex flex-col gap-6">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <VerificationStatusBanner status={status} />

      <Typography variant="sectionTitle" className="mb-2">
        {isEditMode ? "Edit Cause" : "Create a New Cause"}
      </Typography>
      <Typography variant="body" className="mb-8 text-body">
        {isEditMode
          ? "Update the details of this volunteering opportunity."
          : "Publish a new volunteering opportunity for people to join."}
      </Typography>

      {submitError && (
        <p className="mb-4 rounded-lg border border-danger bg-danger/5 px-3 py-2 text-sm text-danger">
          {submitError}
        </p>
      )}

      {successMessage && (
        <p className="mb-4 rounded-lg border border-green-600 bg-green-50 px-3 py-2 text-sm text-green-700">
          {successMessage}
        </p>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CauseForm
            categories={categories}
            submitting={submitting}
            submitDisabled={!isVerified}
            submitLabel={isEditMode ? "Save Changes" : "Publish Cause"}
            imagePreview={imagePreview}
            imageError={imageError}
            onImageChange={handleFileChange}
          />
          {!isVerified && (
            <p className="text-sm text-heading/50 mt-2">
              You can prepare this cause now, but publishing requires your organization to be
              verified first.
            </p>
          )}
        </form>
      </FormProvider>
    </div>
  );
}