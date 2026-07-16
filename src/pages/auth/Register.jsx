import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import AccountSwitch from '../../components/forms/AccountSwitcher'
import OrganizationForm from '../../components/forms/orgForm'
import VolunteerForm from '../../components/forms/volunteerForm'
import { ROUTES, AUTH_QUERY_KEYS } from '../../constants/paths'
import { ACCOUNT_TYPES, isAccountType } from '../../constants/auth/accountTypes'
import AuthShell from '../../components/auth/AuthShell'
import { useAuth } from '../../context/AuthContext'
import useAsyncAction from '../../hooks/useAsyncAction'
import { mapZodErrors, parseRegisterForm } from '../../utils/auth/validation'
import { registerUser } from '../../services/auth'

const initialValues = {

  firstName: '' ,
  lastName: '',
  orgName: '',
  contactPerson: '',
  verificationImage: null,
  email: '',
  phone: '',
  password: '',
}

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const [successMessage, setSuccessMessage] = useState('')
  const { loading, error, execute, clearError } = useAsyncAction(registerUser)

  const accountTypeFromQuery = searchParams.get(AUTH_QUERY_KEYS.TYPE)
  const accountType = isAccountType(accountTypeFromQuery)
    ? accountTypeFromQuery
    : ACCOUNT_TYPES.VOLUNTEER

  const isVolunteer = accountType === ACCOUNT_TYPES.VOLUNTEER

  const subtitle = useMemo(() => {
    if (isVolunteer) return 'Join our community and make a difference!'
    return 'Register your charity or NGO to connect with volunteers.'
  }, [isVolunteer])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  })

  const handleFormChange = () => {
    clearError()
    setSuccessMessage('')
  }

  const onSubmit = async (values) => {
    const validationResult = parseRegisterForm(values, accountType)
    if (!validationResult.success) {
      const fieldErrors = mapZodErrors(validationResult.error)
      Object.entries(fieldErrors).forEach(([name, message]) => {
        setError(name, { type: 'manual', message })
      })
      return
    }

    const payload = {
      type: accountType,
      email: validationResult.data.email,
      password: validationResult.data.password,
      phone: validationResult.data.phone,
      ...(isVolunteer
        ? {
            firstName: validationResult.data.firstName,
            lastName: validationResult.data.lastName,
          }
        : {
            orgName: validationResult.data.orgName,
            contactPerson: validationResult.data.contactPerson,
          }),
    }

    const result = await execute(payload)
    if (!result?.success) return

    if (!login(result.data)) {
      setSuccessMessage('')
      setError('root', {
        type: 'manual',
        message: 'Account created but session could not be started. Please sign in.',
      })
      return
    }

    setSuccessMessage('Account created successfully. Redirecting to your profile...')

    if (isVolunteer) navigate(ROUTES.VOLUNTEER_PROFILE)
    else navigate(ROUTES.ORGANIZATION_PROFILE)
  }

  return (
    <AuthShell
      title={"Create Account"}
      subtitle={subtitle}
      footer={
        <>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className='text-primary hover:underline'>
            Sign In
          </Link>
        </>
      }
    >
      <AccountSwitch accountType={accountType} />

   
          <form
            className='space-y-4'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
      
          >
            {isVolunteer ? (
              <VolunteerForm register={register} errors={errors} onFieldChange={handleFormChange} />
            ) : (
              <OrganizationForm register={register} errors={errors} onFieldChange={handleFormChange} />
            )}

            <Input
              label='Email'
              type='email'
              name='email'
              register={register}
              registerOptions={{ onChange: handleFormChange }}
              placeholder={isVolunteer ? 'you@example.com' : 'org@example.com'}
              error={errors.email?.message}
              autoComplete='email'
              required
            />

            <Input
              label={`Phone Number${!isVolunteer ? ' *' : ''}`}
              type='tel'
              name='phone'
              register={register}
              registerOptions={{ onChange: handleFormChange }}
              placeholder='+1 234 567 890'
              error={errors.phone?.message}
              autoComplete='tel'
              required={!isVolunteer}
            />

            <Input
              label='Password'
              type='password'
              name='password'
              register={register}
              registerOptions={{ onChange: handleFormChange }}
              placeholder='********'
              error={errors.password?.message}
              autoComplete='new-password'
              required
            />

            {error || errors.root?.message ? (
              <p className='rounded-lg border border-danger bg-red-500/10 px-3 py-2 text-sm text-red-200'>
                {error || errors.root?.message}
              </p>
            ) : null}

            {successMessage ? (
              <p className='rounded-lg border border-green-500 bg-green-500/10 px-3 py-2 text-sm text-green-200'>{successMessage}</p>
            ) : null}

            <Button type='submit' disabled={loading} fullWidth>
              {loading ? 'Creating...' : isVolunteer ? 'Create Account' : 'Register Organization'}
            </Button>
          </form>
    </AuthShell>
  )
}

