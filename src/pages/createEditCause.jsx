import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "../components/ui/Typography";
import CauseForm from "../components/organization/CauseForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
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

    setSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || "Something went wrong");
      return;
    }

    navigate(ROUTES.MY_CAUSES);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LoadingSpinner message="Loading cause details..." />
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

      {submitError && <p className="text-sm text-danger mb-4">{submitError}</p>}

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