"use client"

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { project_name } from '../config';

const faqs = [
  {
    question: `How does ${project_name} integrate with my existing business?`,
    answer:
      `${project_name} seamlessly integrates with your current e-commerce platforms like Shopify, WooCommerce, and more. Our API connects to your inventory, payment systems, and customer data to provide a unified experience. Setup takes just 5 minutes with our guided onboarding process.`,
  },
  {
    question: `What makes ${project_name}'s AI different from other chatbots?`,
    answer:
      `Our AI is specifically trained for commerce conversations. Unlike generic chatbots, ${project_name} understands product catalogs, handles complex queries about specifications, manages inventory in real-time, and can complete full sales transactions. It learns from every interaction to improve conversion rates.`,
  },
  {
    question: `Is my customer data secure with ${project_name}?`,
    answer:
      "Absolutely. We use bank-level encryption, comply with GDPR and CCPA regulations, and never store sensitive payment information. All data is encrypted in transit and at rest. We're SOC 2 Type II certified and undergo regular security audits.",
  },
  {
    question: "Can I customize the AI responses for my brand?",
    answer:
      "Yes! You can train the AI with your brand voice, product knowledge, and specific responses. Upload your brand guidelines, FAQs, and product information. The AI will maintain your brand personality while handling customer conversations professionally.",
  },
  {
    question: `What's the average ROI businesses see with ${project_name}?`,
    answer:
      "Our customers typically see a 300% increase in conversion rates and 40% reduction in customer service costs within the first 3 months. The average ROI is 500% in the first year, with some businesses seeing returns as high as 1000%.",
  },
  {
    question: `Do I need technical knowledge to set up ${project_name}?`,
    answer:
      "Not at all! Our no-code setup process guides you through everything. Connect your WhatsApp Business account, sync your product catalog, and you're ready to go. Our support team provides free onboarding assistance for all plans.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div>
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Everything you need to know about {project_name}. Can't find what you're looking for?
          <a href="#" className="text-red-600 hover:text-red-700 font-semibold ml-1">
            Chat with our team
          </a>
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <motion.button
              className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
            >
              <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <Plus className="w-5 h-5 text-gray-500" />
              </motion.div>
            </motion.button>

            <motion.div
              initial={false}
              animate={{
                height: openIndex === index ? "auto" : 0,
                opacity: openIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
