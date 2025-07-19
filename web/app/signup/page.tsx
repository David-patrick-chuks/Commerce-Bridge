"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Clock, Loader2, MessageCircle, Store, Upload, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const WHATSAPP_OFFICIAL_NUMBER = '+2347081643714'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_OFFICIAL_NUMBER.replace('+', '')}`

interface FormData {
  name: string
  email: string
  phoneNumber: string
  userType: 'customer' | 'seller'
  storeName: string
  storeDescription: string
  storeAddress: string
  storeCategories: string[]
  profileImage: File | null
}

export default function SignupPage() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: searchParams.get('wa') || '',
    userType: 'customer',
    storeName: '',
    storeDescription: '',
    storeAddress: '',
    storeCategories: [],
    profileImage: null
  })
  
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [expired, setExpired] = useState(false)
  const [validating, setValidating] = useState(false)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)

  const code = searchParams.get('code')

  useEffect(() => {
    // Fetch categories
    fetch(`${API_BASE}/api/users/all-categories`)
      .then(res => res.json())
      .then(data => setAllCategories(data.categories || []))
      .catch(console.error)

    // Validate code if present
    if (code) {
      setValidating(true)
      fetch(`${API_BASE}/api/shorten/validate/${code}`)
        .then(async res => {
          if (res.status === 410 || res.status === 404) {
            setExpired(true)
          }
          setValidating(false)
        })
        .catch(() => {
          setExpired(true)
          setValidating(false)
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
          setCsrfToken(token)
          return
        }
        return res.json().then(data => {
          if (data?.csrfToken) setCsrfToken(data.csrfToken)
        })
      })
      .catch(() => setCsrfToken(null))
  }, [code])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      storeCategories: prev.storeCategories.includes(category)
        ? prev.storeCategories.filter(c => c !== category)
        : [...prev.storeCategories, category]
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleInputChange('profileImage', file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    setExpired(false)

    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('phoneNumber', formData.phoneNumber)
      submitData.append('userType', formData.userType)
      
      if (formData.userType === 'seller') {
        submitData.append('storeName', formData.storeName)
        submitData.append('storeDescription', formData.storeDescription)
        submitData.append('storeAddress', formData.storeAddress)
        formData.storeCategories.forEach(cat => submitData.append('storeCategories[]', cat))
        if (formData.profileImage) submitData.append('profileImage', formData.profileImage)
      }

      const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        body: submitData,
        credentials: 'include',
        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
      })

      if (res.status === 410) {
        setExpired(true)
        return
      }

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create account')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg font-medium">Validating link...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-xl mb-2">Link Expired</CardTitle>
            <CardDescription className="mb-6">
              This account creation link has expired. Please request a new one from our support team.
            </CardDescription>
            <Button asChild className="w-full">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact WhatsApp Support
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-xl mb-2">Account Created!</CardTitle>
            <CardDescription className="mb-6">
              Your account has been successfully created. You can now continue chatting on WhatsApp.
            </CardDescription>
            <Button asChild className="w-full">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Continue on WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join Taja and start shopping or selling through WhatsApp</p>
        </div>

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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                    onChange={(e) => handleInputChange('email', e.target.value)}
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
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  required
                  placeholder="Enter your WhatsApp number"
                  readOnly={!!searchParams.get('wa')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">Account Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formData.userType === 'customer' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('userType', 'customer')}
                    className="h-12"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Customer
                  </Button>
                  <Button
                    type="button"
                    variant={formData.userType === 'seller' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('userType', 'seller')}
                    className="h-12"
                  >
                    <Store className="mr-2 h-4 w-4" />
                    Seller
                  </Button>
                </div>
              </div>

              {/* Seller Information */}
              {formData.userType === 'seller' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Store className="mr-2 h-5 w-5" />
                      <h3 className="text-lg font-semibold">Store Information</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        type="text"
                        value={formData.storeName}
                        onChange={(e) => handleInputChange('storeName', e.target.value)}
                        required
                        placeholder="Enter your store name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storeDescription">Store Description</Label>
                      <Textarea
                        id="storeDescription"
                        value={formData.storeDescription}
                        onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                        placeholder="Describe your store and what you sell"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storeAddress">Store Address</Label>
                      <Input
                        id="storeAddress"
                        type="text"
                        value={formData.storeAddress}
                        onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                        placeholder="Enter your store address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Store Categories</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {allCategories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={category}
                              checked={formData.storeCategories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label htmlFor={category} className="text-sm font-normal">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Profile Image</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {formData.profileImage && (
                          <Badge variant="secondary">
                            <Upload className="mr-1 h-3 w-3" />
                            {formData.profileImage.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </>
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
      </div>
    </div>
  )
} 