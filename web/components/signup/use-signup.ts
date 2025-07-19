import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { SignupFormData, SignupState } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export function useSignup() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<SignupState>({
    formData: {
      name: '',
      email: '',
      phoneNumber: searchParams.get('wa') || '',
      userType: 'customer',
      storeName: '',
      storeDescription: '',
      storeAddress: '',
      storeCategories: [],
      profileImage: null
    },
    allCategories: [],
    loading: false,
    success: false,
    error: '',
    expired: false,
    validating: false,
    csrfToken: null
  })

  const code = searchParams.get('code')

  useEffect(() => {
    // Fetch categories
    fetch(`${API_BASE}/api/users/all-categories`)
      .then(res => res.json())
      .then(data => setState(prev => ({ ...prev, allCategories: data.categories || [] })))
      .catch(console.error)

    // Validate code if present
    if (code) {
      setState(prev => ({ ...prev, validating: true }))
      fetch(`${API_BASE}/api/shorten/validate/${code}`)
        .then(async res => {
          if (res.status === 410 || res.status === 404) {
            setState(prev => ({ ...prev, expired: true }))
          }
          setState(prev => ({ ...prev, validating: false }))
        })
        .catch(() => {
          setState(prev => ({ ...prev, expired: true, validating: false }))
        })
    }

    // Fetch CSRF token
    fetch(`${API_BASE}/api/users`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => {
        const token = res.headers.get('x-csrf-token')
        if (token) {
          setState(prev => ({ ...prev, csrfToken: token }))
          return
        }
        return res.json().then(data => {
          if (data?.csrfToken) setState(prev => ({ ...prev, csrfToken: data.csrfToken }))
        })
      })
      .catch(() => setState(prev => ({ ...prev, csrfToken: null })))
  }, [code])

  const updateFormData = (field: keyof SignupFormData, value: any) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: '', 
      success: false, 
      expired: false 
    }))

    try {
      const submitData = new FormData()
      submitData.append('name', state.formData.name)
      submitData.append('email', state.formData.email)
      submitData.append('phoneNumber', state.formData.phoneNumber)
      submitData.append('userType', state.formData.userType)
      
      if (state.formData.userType === 'seller') {
        submitData.append('storeName', state.formData.storeName)
        submitData.append('storeDescription', state.formData.storeDescription)
        submitData.append('storeAddress', state.formData.storeAddress)
        state.formData.storeCategories.forEach(cat => submitData.append('storeCategories[]', cat))
        if (state.formData.profileImage) submitData.append('profileImage', state.formData.profileImage)
      }

      const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        body: submitData,
        credentials: 'include',
        headers: state.csrfToken ? { 'X-CSRF-Token': state.csrfToken } : undefined,
      })

      if (res.status === 410) {
        setState(prev => ({ ...prev, expired: true }))
        return
      }

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create account')
      }

      setState(prev => ({ ...prev, success: true }))
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || 'Failed to create account' }))
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  return {
    ...state,
    updateFormData,
    handleSubmit
  }
} 