import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { ROUTES, AUTH_QUERY_KEYS } from '../../constants/paths'
import { ACCOUNT_TYPES } from '../../constants/auth/accountTypes'
import AuthShell from '../../components/auth/AuthShell'
import { useAuth } from '../../context/AuthContext'
import useAsyncAction from '../../hooks/useAsyncAction'
import { loginSchema } from '../../utils/auth/validation'
import { loginUser } from '../../services/auth'

const initialValues = {
  email: '',
  password: '',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  // نفس هوك إدارة الـ loading/error المستخدم بصفحة Register — بدل ما كانت
  // Login تدير هالحالة يدويًا بـ useState منفصلة، صار السلوك موحّدًا بين
  // الصفحتين (نفس التعامل مع النجاح/الفشل/الاستثناءات غير المتوقعة)
  const { loading, error, execute, clearError } = useAsyncAction(loginUser)

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: initialValues,
  })

  const handleFieldChange = useCallback(() => {
    clearError()
  }, [clearError])

  // يفرّغ الباسورد بس (الإيميل بيضل زي ما هو) ويرجّع الفوكس له، جاهز
  // لإعادة المحاولة — نفس السلوك المتّبع بـ Google/GitHub لأي محاولة فاشلة
  const clearPasswordAndFocus = () => {
    setValue('password', '')
    setFocus('password')
  }

  const onSubmit = async (values) => {
    const result = await execute(values)
    if (!result?.success) {
      clearPasswordAndFocus()
      return
    }

    if (!login(result.data)) {
      setError('root', {
        type: 'manual',
        message: 'Received invalid authentication response. Please try again.',
      })
      clearPasswordAndFocus()
      return
    }

    navigate(ROUTES.HOME)
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
          registerOptions={{ onChange: handleFieldChange }}
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
          registerOptions={{ onChange: handleFieldChange }}
          placeholder='********'
          error={errors.password?.message}
          autoComplete='current-password'
          required
        />

        {error || errors.root?.message ? (
          <p className='rounded-lg border border-danger bg-red-500/10 px-3 py-2 text-sm text-danger'>
            {error || errors.root?.message}
          </p>
        ) : null}

        <Button type='submit' disabled={loading} fullWidth>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </AuthShell>
  )
}