import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from 'next';
import { project_name } from '../config';
import './globals.css';

// SEO Configuration
const siteConfig = {
  name: project_name,
  description: `${project_name} is a WhatsApp-first e-commerce platform where customers and sellers interact entirely through a smart chatbot interface. Shop seamlessly, manage your store, and handle all transactions through WhatsApp.`,
  url: 'https://taja.com',
  ogImage: '/og-image.png',
  logo: '/logo.png',
  creator: '@davepatty5686',
  keywords: [
    'WhatsApp e-commerce',
    'chatbot shopping',
    'social commerce',
    'mobile commerce',
    'WhatsApp business',
    'online marketplace',
    'digital payments',
    'customer support',
    'seller tools',
    'inventory management'
  ].join(', '),
  authors: [{ name: 'CommerceBridge Team' }],
  category: 'E-commerce Platform',
  classification: 'Business',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light dark',
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'fr-FR': '/fr-FR',
      'es-ES': '/es-ES',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - WhatsApp-first E-commerce Platform`,
        type: 'image/png',
      },
      {
        url: siteConfig.logo,
        width: 800,
        height: 600,
        alt: `${siteConfig.name} Logo`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
    site: siteConfig.creator,
  },
  robots: siteConfig.robots,
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  category: siteConfig.category,
  classification: siteConfig.classification,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': siteConfig.name,
    'application-name': siteConfig.name,
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#000000',
    'mobile-web-app-capable': 'yes',
  },
};

// Structured Data for Rich Snippets
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.logo}`,
  description: siteConfig.description,
  sameAs: [
    'https://twitter.com/davepatty5686',
    'https://facebook.com/taja',
    'https://instagram.com/taja',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+2347081643714',
    contactType: 'customer service',
    availableLanguage: ['English', 'French', 'Spanish'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NG',
  },
  founder: {
    '@type': 'Person',
    name: 'CommerceBridge Team',
  },
  foundingDate: '2024',
  knowsAbout: [
    'E-commerce',
    'WhatsApp Business API',
    'Mobile Commerce',
    'Digital Payments',
    'Customer Support',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.whatsapp.com" />
        <link rel="preconnect" href="https://checkout.paystack.co" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.whatsapp.com" />
        <link rel="dns-prefetch" href="//checkout.paystack.co" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
