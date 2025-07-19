"use client"

import { SignupForm } from '@/components/signup/signup-form'
import { StatusCards } from '@/components/signup/status-cards'
import { useSignup } from '@/components/signup/use-signup'

export default function SignupPage() {
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