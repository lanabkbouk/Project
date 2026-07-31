import { useFormContext, Controller } from "react-hook-form";
import { MapPin, Tag, ImagePlus } from "lucide-react";
import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { SYRIAN_GOVERNORATES } from "../../services/syrianGovernorates";

const GOVERNORATE_ITEMS = SYRIAN_GOVERNORATES.map(({ nameEn }) => ({
  name: nameEn,
  value: nameEn === "Rural Damascus" ? "Rif Dimashq" : nameEn,
}));

export default function CauseForm({
  categories,
  submitting,
  submitDisabled = false,
  submitLabel = "Publish Cause",
  imagePreview,
  onImageChange,
  imageError,
}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const categoryItems = categories.map((category) => ({
    name: category.name,
    value: category.id,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* صورة الفرصة — اختيارية، تُعرض بكارد الفرصة والقائمة إن وُجدت */}
      <div className="flex flex-col gap-1">
        <label className="mb-1 text-sm font-medium text-heading">Cover Image (optional)</label>
        <label
          htmlFor="cause-image"
          className="flex items-center gap-3 rounded-xl border border-dashed border-heading/20 bg-heading/5 px-4 py-3 cursor-pointer hover:border-primary/40 transition"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Cover preview" className="h-14 w-14 rounded-lg object-cover" />
          ) : (
            <div className="h-14 w-14 rounded-lg bg-heading/10 flex items-center justify-center text-heading/40">
              <ImagePlus size={22} />
            </div>
          )}
          <span className="text-sm text-body">
            {imagePreview ? "Change image" : "Click to upload a cover image (JPG or PNG)"}
          </span>
        </label>
        <input id="cause-image" type="file" accept="image/*" className="hidden" onChange={onImageChange} />
        {imageError && <p className="text-xs text-danger">{imageError}</p>}
      </div>

      <Input
        label="Title"
        name="title"
        register={register}
        error={errors.title?.message}
        placeholder="e.g. Clean Water for All"
        required
      />

      <Textarea
        label="Description"
        name="description"
        register={register}
        placeholder="Describe what volunteers will do, and why it matters..."
        error={errors.description?.message}
        className="min-h-[140px]"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Controller
          name="categoryId"
          control={control}
          defaultValue=""
          render={({ field: { value, onChange } }) => (
            <Dropdown
              label="Category"
              items={categoryItems}
              value={value}
              onChange={onChange}
              placeholder="Select a category"
              icon={Tag}
              error={errors.categoryId?.message}
              required
            />
          )}
        />

        <Controller
          name="city"
          control={control}
          defaultValue=""
          render={({ field: { value, onChange } }) => (
            <Dropdown
              label="Governorate"
              items={GOVERNORATE_ITEMS}
              value={value}
              onChange={onChange}
              placeholder="Select a governorate"
              icon={MapPin}
              error={errors.city?.message}
              required
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Start Date"
          name="startDate"
          type="date"
          register={register}
          error={errors.startDate?.message}
          required
        />
        <Input
          label="End Date"
          name="endDate"
          type="date"
          register={register}
          error={errors.endDate?.message}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Input
          label="Min Hours"
          name="minHours"
          type="number"
          min="1"
          register={register}
          error={errors.minHours?.message}
          required
        />
        <Input
          label="Max Hours"
          name="maxHours"
          type="number"
          min="1"
          register={register}
          error={errors.maxHours?.message}
          required
        />
        <Input
          label="Volunteers Needed"
          name="maxVolunteers"
          type="number"
          min="1"
          register={register}
          error={errors.maxVolunteers?.message}
          required
        />
      </div>

      <Button
        type="submit"
        size="large"
        isLoading={submitting}
        loadingText="Saving..."
        disabled={submitDisabled}
        className="self-start mt-2"
      >
        {submitLabel}
      </Button>
    </div>
  );
}