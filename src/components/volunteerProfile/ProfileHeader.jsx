import ImageUploader from "../common/ImageUploader";
import GenderBadge from "../common/GenderBadge";
import Badge from "../common/Badge";
import Typography from "../ui/Typography";

export default function ProfileHeader({
  fullName,
  gender,
  imagePreview,
  onImageChange,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-8 
                    bg-heading/5 border border-heading/10 
                    px-8 py-10 rounded-xl shadow-sm">

      {/* الصورة + الاسم */}
      <div className="flex items-center gap-6">

        <ImageUploader
          previewUrl={imagePreview}
          onFileChange={onImageChange}
          shape="square"
          size="md"
          fallbackIcon={null}
          fallbackText={fullName?.[0]?.toUpperCase() || "V"}
        />

        <div className="flex flex-col">
          <Typography variant="h2" color="heading">
            {fullName}
          </Typography>

          <Typography variant="bodySm" color="muted" className="mt-1">
            Volunteer Profile
          </Typography>
        </div>
      </div>

      {/* الحالة + الجنس */}
      <div className="md:ml-auto flex flex-col items-end gap-4">
        {/* <Badge label="Active" tone="primary" /> */}
        <GenderBadge gender={gender} />
      </div>
    </div>
  );
}
