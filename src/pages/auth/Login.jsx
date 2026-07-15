import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { ROUTES, AUTH_QUERY_KEYS } from '../../constants/paths'
import { ACCOUNT_TYPES } from '../../constants/auth/accountTypes'
import AuthShell from '../../components/auth/AuthShell'
import { useAuth } from '../../context/AuthContext'
import { mapZodErrors, parseLoginForm } from '../../utils/auth/validation'
import { loginUser } from '../../services/auth'

const initialValues = {
  email: '',
  password: '',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setAuthError] = useState('')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  })

  const clearError = useCallback(() => {
    setAuthError('')
  }, [])

  const onSubmit = async (values) => {
    const validationResult = parseLoginForm(values)
    if (!validationResult.success) {
      const fieldErrors = mapZodErrors(validationResult.error)
      Object.entries(fieldErrors).forEach(([name, message]) => {
        setError(name, { type: 'manual', message })
      })
      return
    }

    setLoading(true)
    setAuthError('')

    try {
      const result = await loginUser(validationResult.data)

      if (!result?.success) {
        setAuthError(result?.error || 'Unable to sign in')
        return
      }

      if (!login(result.data)) {
        setAuthError('Received invalid authentication response')
        return
      }

      navigate(ROUTES.HOME)
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unexpected error'
      setAuthError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title='Sign In'
      subtitle='Welcome back! Please enter your details.'
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            to={`${ROUTES.REGISTER}?${AUTH_QUERY_KEYS.TYPE}=${ACCOUNT_TYPES.VOLUNTEER}`}
            className='text-primary hover:underline'
          >
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4' noValidate>
        <Input
          label='Email'
          type='email'
          name='email'
          register={register}
          registerOptions={{ onChange: clearError }}
          placeholder='you@example.com'
          error={errors.email?.message}
          autoComplete='email'
          required
        />

        <Input
          label='Password'
          type='password'
          name='password'
          register={register}
          registerOptions={{ onChange: clearError }}
          placeholder='********'
          error={errors.password?.message}
          autoComplete='current-password'
          required
        />

        {error ? (
          <p className='rounded-lg border border-danger bg-red-500/10 px-3 py-2 text-sm text-red-200'>{error}</p>
        ) : null}

        <Button type='submit' disabled={loading} fullWidth>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </AuthShell>
  )
}
