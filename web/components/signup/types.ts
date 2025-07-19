export interface SignupFormData {
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

export interface SignupState {
  formData: SignupFormData
  allCategories: string[]
  loading: boolean
  success: boolean
  error: string
  expired: boolean
  validating: boolean
  csrfToken: string | null
} 