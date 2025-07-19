"use client"

import { SignupForm } from '@/components/signup/signup-form'
import { StatusCards } from '@/components/signup/status-cards'
import { useSignup } from '@/components/signup/use-signup'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

function SignupContent() {
  const {
    formData,
    allCategories,
    loading,
    success,
    error,
    expired,
    validating,
    updateFormData,
    handleSubmit
  } = useSignup()

  // Show status cards for different states
  if (validating) return <StatusCards type="validating" />
  if (expired) return <StatusCards type="expired" />
  if (success) return <StatusCards type="success" />

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join Taja and start shopping or selling through WhatsApp</p>
        </div>

        <SignupForm
          formData={formData}
          onFormDataChange={updateFormData}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          allCategories={allCategories}
        />
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
} 