import { useCallback, useState } from 'react'

export default function useAsyncAction(action) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const clearError = useCallback(() => {
    setError('')
  }, [])

  const execute = useCallback(
    async (payload) => {
      setLoading(true)
      setError('')

      try {
        const result = await action(payload)
        if (!result?.success) {
          const message = result?.error || 'Something went wrong'
          setError(message)
          // نمرر fieldErrors كما هي (أو null) بدل ما نتجاهلها — الصفحة
          // (Login/Register) هي يلي بتقرر تربطها بحقول الفورم أو لأ.
          // نُبقي أي حقول إضافية رجعتها الخدمة (متل isTokenError بصفحة
          // ResetPassword) عبر ...result بدل ما تُفقد صمتًا هون
          return { ...result, success: false, error: message, fieldErrors: result?.fieldErrors || null }
        }

        return result
      } catch (actionError) {
        const message = actionError instanceof Error ? actionError.message : 'Unexpected error'
        setError(message)
        return { success: false, error: message }
      } finally {
        setLoading(false)
      }
    },
    [action],
  )

  return { loading, error, execute, clearError }
}