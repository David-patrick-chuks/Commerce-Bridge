"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Loader2, MessageCircle } from 'lucide-react'

const WHATSAPP_OFFICIAL_NUMBER = '+2347081643714'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_OFFICIAL_NUMBER.replace('+', '')}`

interface StatusCardsProps {
  type: 'validating' | 'expired' | 'success'
}

export function StatusCards({ type }: StatusCardsProps) {
  if (type === 'validating') {
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

  if (type === 'expired') {
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

  if (type === 'success') {
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

  return null
} 