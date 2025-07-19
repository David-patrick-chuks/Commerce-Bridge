"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Store, User } from 'lucide-react'
import { SellerForm } from './seller-form'
import { FormData } from './types'

interface SignupFormProps {
  formData: FormData
  onFormDataChange: (field: keyof FormData, value: any) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  loading: boolean
  error: string
  allCategories: string[]
}

export function SignupForm({ 
  formData, 
  onFormDataChange, 
  onSubmit, 
  loading, 
  error, 
  allCategories 
}: SignupFormProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFormDataChange('profileImage', file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription>
          Fill in your details to create your Taja account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => onFormDataChange('name', e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onFormDataChange('email', e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => onFormDataChange('phoneNumber', e.target.value)}
              required
              placeholder="Enter your WhatsApp number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">Account Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={formData.userType === 'customer' ? 'default' : 'outline'}
                onClick={() => onFormDataChange('userType', 'customer')}
                className="h-12"
              >
                <User className="mr-2 h-4 w-4" />
                Customer
              </Button>
              <Button
                type="button"
                variant={formData.userType === 'seller' ? 'default' : 'outline'}
                onClick={() => onFormDataChange('userType', 'seller')}
                className="h-12"
              >
                <Store className="mr-2 h-4 w-4" />
                Seller
              </Button>
            </div>
          </div>

          {/* Seller Information */}
          {formData.userType === 'seller' && (
            <SellerForm 
              formData={formData}
              onFormDataChange={onFormDataChange}
              allCategories={allCategories}
              onImageChange={handleImageChange}
            />
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 