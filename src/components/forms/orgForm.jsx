import Input from '../ui/Input'

export default function OrganizationForm({ register, errors, onFieldChange }) {
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
        required
      />
      <Input
        label='Organization Verification Image'
        name='verificationImage'
        type='file'
        accept='image/*'
        register={register}
        registerOptions={{ onChange: onFieldChange }}
        required
        error={errors?.verificationImage?.message}
      />

      
    </>
  )
}
