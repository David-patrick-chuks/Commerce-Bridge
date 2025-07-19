"use client"

import { motion } from "framer-motion"

const integrations = [
  { name: "Shopify", logo: "🛍️" },
  { name: "WooCommerce", logo: "🛒" },
  { name: "Stripe", logo: "💳" },
  { name: "PayPal", logo: "💰" },
  { name: "Zapier", logo: "⚡" },
  { name: "HubSpot", logo: "📊" },
  { name: "Mailchimp", logo: "📧" },
  { name: "Slack", logo: "💬" },
]

export default function IntegrationShowcase() {
  // Duplicate the integrations array to create seamless loop
  const duplicatedIntegrations = [...integrations, ...integrations]

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-gray-600 font-medium mb-8">
          Trusted by 50,000+ businesses worldwide and seamlessly integrates with your favorite tools
        </p>

        <div className="relative overflow-hidden">
          <div className="flex items-center gap-8 lg:gap-12 animate-marquee whitespace-nowrap">
            {duplicatedIntegrations.map((integration, index) => (
              <div
                key={`${integration.name}-${index}`}
                className="flex items-center space-x-3 text-gray-400 hover:text-gray-600 transition-colors duration-300 flex-shrink-0"
              >
                <span className="text-2xl">{integration.logo}</span>
                <span className="font-semibold text-lg">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
