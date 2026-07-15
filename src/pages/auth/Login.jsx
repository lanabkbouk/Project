import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { ROUTES, AUTH_QUERY_KEYS } from '../../app/routes/paths'
import { ACCOUNT_TYPES } from '../../constants/auth/accountTypes'
import AuthShell from '../../components/auth/AuthShell'
import { loginSuccess, setError as setAuthError, setLoading } from '../../app/redux/authSlice'
import { selectAuthError, selectAuthLoading } from '../../app/redux/authSekector'
import { mapZodErrors, parseLoginForm } from '../../utils/auth/validation'
import { loginUser } from '../../services/auth'

const initialValues = {
  email: '',
  password: '',
}

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  })

  const clearError = useCallback(() => {
    dispatch(setAuthError(''))
  }, [dispatch])

  const onSubmit = async (values) => {
    const validationResult = parseLoginForm(values)
    if (!validationResult.success) {
      const fieldErrors = mapZodErrors(validationResult.error)
      Object.entries(fieldErrors).forEach(([name, message]) => {
        setError(name, { type: 'manual', message })
      })
      return
    }

    dispatch(setLoading(true))
    dispatch(setAuthError(''))

    try {
      const result = await loginUser(validationResult.data)

      if (!result?.success) {
        dispatch(setAuthError(result?.error || 'Unable to sign in'))
        return
      }

      if (!result.data?.user || !result.data?.token || !result.data?.accountType) {
        dispatch(setAuthError('Received invalid authentication response'))
        return
      }

      dispatch(loginSuccess(result.data))
      // after login, go to Home (authenticated landing)
      navigate(ROUTES.HOME)
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unexpected error'
      dispatch(setAuthError(message))
    } finally {
      dispatch(setLoading(false))
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
