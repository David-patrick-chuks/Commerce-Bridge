"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Upload, Store } from 'lucide-react'
import { SignupFormData } from './types'

interface SellerFormProps {
  formData: SignupFormData
  onFormDataChange: (field: keyof SignupFormData, value: any) => void
  allCategories: string[]
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SellerForm({ 
  formData, 
  onFormDataChange, 
  allCategories, 
  onImageChange 
}: SellerFormProps) {
  const handleCategoryChange = (category: string) => {
    onFormDataChange('storeCategories', 
      formData.storeCategories.includes(category)
        ? formData.storeCategories.filter(c => c !== category)
        : [...formData.storeCategories, category]
    )
  }

  return (
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
            onChange={(e) => onFormDataChange('storeName', e.target.value)}
            required
            placeholder="Enter your store name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeDescription">Store Description</Label>
          <Textarea
            id="storeDescription"
            value={formData.storeDescription}
            onChange={(e) => onFormDataChange('storeDescription', e.target.value)}
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
            onChange={(e) => onFormDataChange('storeAddress', e.target.value)}
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
              onChange={onImageChange}
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
  )
} 