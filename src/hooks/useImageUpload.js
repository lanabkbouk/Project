
// يفصل منطق (اختيار صورة + التحقق منها + المعاينة المحلية) عن أي Component،
// بحيث ProfileHeader و OrgProfile وأي صفحة لاحقة (صورة الفرصة) تستخدم نفس
// الـ hook بدل تكرار FileReader ومنطق التحقق بكل صفحة.

import { useState, useCallback } from 'react'
import { validateImageFile } from '../services/api/mediaUpload'

/**
 * @param {string} [initialPreviewUrl] - رابط الصورة الحالية (مثلاً القادمة من الباك اند)
 */
export function useImageUpload(initialPreviewUrl = '') {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(initialPreviewUrl)
  const [error, setError] = useState('')

  // يُستدعى مباشرة من onChange لحقل <input type="file" />
  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const { valid, error: validationError } = validateImageFile(selectedFile)
    if (!valid) {
      setError(validationError)
      return
    }

    setError('')
    setFile(selectedFile)

    // معاينة محلية فورية قبل أي رفع فعلي للسيرفر
    const reader = new FileReader()
    reader.onload = () => setPreviewUrl(reader.result)
    reader.readAsDataURL(selectedFile)
  }, [])

  // يرجّع الحالة لوضعها الأصلي (مثلاً بعد إلغاء التعديل)
  const reset = useCallback((resetPreviewUrl = '') => {
    setFile(null)
    setPreviewUrl(resetPreviewUrl)
    setError('')
  }, [])

  return { file, previewUrl, error, handleFileChange, reset, setPreviewUrl }
}