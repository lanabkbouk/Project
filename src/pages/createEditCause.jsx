import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "../components/ui/Typography";
import CauseForm from "../components/organization/CauseForm";
import Skeleton from "../components/ui/Skeleton";
import VerificationStatusBanner from "../components/OrgProfile/VerificationStatusBanner";
import Toast from "../components/common/Toast";
import { useAuth } from "../context/AuthContext";
import { useOrganizationVerification } from "../hooks/useOrganizationVerification";
import { useCategoriesQuery } from "../hooks/queries/useCategoriesQuery";
import { useOpportunityDetailsQuery } from "../hooks/queries/useOpportunityDetailsQuery";
import { useSaveOpportunityMutation } from "../hooks/queries/useSaveOpportunityMutation";
import { useImageUpload } from "../hooks/useImageUpload";
import { useToast } from "../hooks/useToast";
import { opportunitySchema } from "../utils/opportunityValidation";
import { ROUTES } from "../constants/paths";
import { getOrganizationId } from "../utils/auth/getOrganizationId";

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
  const { user } = useAuth();
  const organizationId = getOrganizationId(user);
  const { status, isVerified, hasLoadError } = useOrganizationVerification();

  // نفس هوك التصنيفات المستخدم بصفحتي الفرص — كاش مشترك، ما بينجلب مرتين
  const categoriesQuery = useCategoriesQuery();
  // بوضع "تعديل" بس: id موجود فبيتفعّل الجلب تلقائيًا (enabled: Boolean(id)
  // داخل الهوك نفسه) — بوضع "إنشاء" الهوك معطّل تلقائيًا بدون أي شرط هون
  const opportunityQuery = useOpportunityDetailsQuery(id);
  // organizationId/organizationName لازمين بس وقت الإنشاء — الهوك نفسه
  // بيتجاهلهم بوضع التعديل (راجع useSaveOpportunityMutation)
  const saveMutation = useSaveOpportunityMutation({
    isEditMode,
    id,
    organizationId,
    organizationName: user?.orgName,
  });

  const categories = categoriesQuery.data ?? [];
  const opportunity = opportunityQuery.data?.opportunity ?? null;

  const { toast, showSuccess, showError, closeToast } = useToast();

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

  // نزامن الفورم ومعاينة الصورة مع بيانات الفرصة أول ما توصل — بوضع
  // "تعديل" بس. useEffect هون شرعي لأنه بيربط بيانات React Query مع
  // نظامين خارجيين (react-hook-form وuseImageUpload)، مو جلب بيانات بحد ذاته
  useEffect(() => {
    if (!isEditMode || !opportunity) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunity, isEditMode]);

  const loading = isEditMode
    ? categoriesQuery.isPending || opportunityQuery.isPending
    : categoriesQuery.isPending;

  const onSubmit = async (values) => {
    const selectedCategory = categories.find((category) => category.id === values.categoryId);
    const payload = {
      ...values,
      category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : null,
      location: values.city,
      imageFile,
    };

    const result = await saveMutation.mutateAsync(payload);

    if (!result.success) {
      showError(result.error || "Something went wrong");
      return;
    }

    // نعرض تأكيد نجاح واضح للمستخدم قبل ما ننتقل، بدل انتقال صامت فوري
    // ما بيعطي أي إحساس إنه الحفظ صار فعلًا
    showSuccess(isEditMode ? "Changes saved successfully." : "Cause published successfully.");
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
      <VerificationStatusBanner status={status} hasLoadError={hasLoadError} />

      <Typography variant="sectionTitle" className="mb-2">
        {isEditMode ? "Edit Cause" : "Create a New Cause"}
      </Typography>
      <Typography variant="body" className="mb-8 text-body">
        {isEditMode
          ? "Update the details of this volunteering opportunity."
          : "Publish a new volunteering opportunity for people to join."}
      </Typography>


      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CauseForm
            categories={categories}
            submitting={saveMutation.isPending}
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

      <Toast
        message={toast.message}
        variant={toast.variant}
        duration={7000}
        onClose={closeToast}
      />
    </div>
  );
}