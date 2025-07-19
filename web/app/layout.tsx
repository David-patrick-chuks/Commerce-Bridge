import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from 'next';
import { project_name } from '../config';
import './globals.css';

export const metadata: Metadata = {
  title: project_name,
  description: `${project_name} is a WhatsApp-first e-commerce platform for seamless shopping and selling experiences.`,
  generator: 'taja-model',
  openGraph: {
    title: project_name,
    description: `${project_name} is a WhatsApp-first e-commerce platform for seamless shopping and selling experiences.`,
    url: 'https://taja.com',
    siteName: project_name,
    images: [
      {
        url: '/placeholder-logo.png',
        width: 800,
        height: 600,
        alt: `${project_name} Logo`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: project_name,
    description: `${project_name} is a WhatsApp-first e-commerce platform for seamless shopping and selling experiences.`,
    images: ['/placeholder-logo.png'],
    creator: '@davepatty5686',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
