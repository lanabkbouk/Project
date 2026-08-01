import Input from '../ui/Input'
import ImageUploader from '../common/ImageUploader'

// نموذج بيانات المنظمة فقط (UI بدون منطق) — منطق رفع/معاينة/التحقق من
// صورة التوثيق موجود بـ Register.jsx (عبر useImageUpload)، هون بس عرض
export default function OrganizationForm({
  register,
  errors,
  onFieldChange,
  verificationImagePreview,
  verificationImageError,
  onVerificationImageChange,
}) {
  return (
    <>
      <Input
        label='Organization Name'
        type='text'
        name='orgName'
        register={register}
        registerOptions={{ onChange: onFieldChange }}
        placeholder='Your Organization'
        error={errors?.orgName?.message}
        labelClassName="text-white"
        required
      />

      <Input
        label='Contact Person'
        type='text'
        name='contactPerson'
        register={register}
        registerOptions={{ onChange: onFieldChange }}
        placeholder='Full Name'
        error={errors?.contactPerson?.message}
        labelClassName="text-white"
        required
      />

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium text-white'>
          Organization Verification Image <span className='text-danger'>*</span>
        </label>

        <div className='flex items-center gap-4'>
          <ImageUploader
            previewUrl={verificationImagePreview}
            onFileChange={onVerificationImageChange}
            shape='square'
            size='md'
            fallbackIcon='organization'
          />
          <p className='text-xs text-gray-400'>JPG, PNG أو WEBP — حتى 2MB</p>
        </div>

        {(verificationImageError || errors?.verificationImage?.message) && (
          <p className='text-sm text-red-400'>
            {verificationImageError || errors?.verificationImage?.message}
          </p>
        )}
      </div>
    </>
  )
}