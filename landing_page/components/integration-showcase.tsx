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

        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              className="flex items-center space-x-3 text-gray-400 hover:text-gray-600 transition-colors duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -2 }}
            >
              <span className="text-2xl">{integration.logo}</span>
              <span className="font-semibold text-lg">{integration.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
