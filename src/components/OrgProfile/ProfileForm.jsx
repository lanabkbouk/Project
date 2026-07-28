import { useFormContext, Controller } from 'react-hook-form'
import { Building2, Globe, MapPin } from 'lucide-react'
import Input from '../ui/Input'
import Dropdown from '../ui/Dropdown'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import { SYRIAN_GOVERNORATES } from '../../services/syrianGovernorates'

const GOVERNORATE_ITEMS = SYRIAN_GOVERNORATES.map(({ nameEn }) => ({
  name: nameEn,
  value: nameEn === 'Rural Damascus' ? 'Rif Dimashq' : nameEn,
}))

export default function OrgProfileForm({ submitting }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="flex flex-col gap-6">

      <h2 className="text-lg font-semibold text-heading mb-2">
        Basic Information
      </h2>

      <Input
        label="Organization Name"
        name="name"
        icon={Building2}
        register={register}
        error={errors.name?.message}
        required
        className="bg-white"
      />

      <div className="flex flex-col gap-1">
        <label className="mb-1 text-sm font-medium text-heading">
          Governorate
        </label>

        <Controller
          name="city"
          control={control}
          defaultValue=""
          render={({ field: { value, onChange } }) => (
            <Dropdown
              items={GOVERNORATE_ITEMS}
              value={value}
              onChange={onChange}
              placeholder="Select your governorate"
              icon={MapPin}
              variant="filled"
              error={errors.city?.message}
              className="bg-white"
            />
          )}
        />
      </div>

      <Input
        label="Website"
        name="website"
        icon={Globe}
        register={register}
        placeholder="https://example.org"
        error={errors.website?.message}
        className="bg-white"
      />

      <div className="flex flex-col gap-1">
        <label className="mb-1 text-sm font-medium text-heading">
          About the Organization
        </label>

        <Textarea
          {...register('description')}
          placeholder="Tell volunteers what your organization does..."
          error={errors.description?.message}
          className="bg-white min-h-[120px]"
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="self-start mt-2 px-6 py-2"
      >
        {submitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}
