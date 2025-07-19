"use client"

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { project_name } from '../config';

const faqs = [
  {
    question: `How does ${project_name} work?`,
    answer:
      `${project_name} is a WhatsApp-first marketplace where everything happens through chat. Customers browse products, search using images/videos/text, and buy by chatting with our AI bot. Sellers upload products by sending photos and details to the bot. No website or app needed - just WhatsApp!`,
  },
  {
    question: `What makes ${project_name} different from other e-commerce platforms?`,
    answer:
      `${project_name} is the first AI-powered WhatsApp marketplace. Unlike traditional platforms that require websites or apps, ${project_name} operates entirely through WhatsApp conversations. Our AI bot handles product browsing, search, payments, and order management - making e-commerce as simple as sending a message.`,
  },
  {
    question: `Can I search for products using images, videos, or text?`,
    answer:
      `Yes! ${project_name} features AI-powered search. Customers can upload product images, videos, or describe what they're looking for, and our AI will find similar items in the catalog. Sellers can also upload product images and videos, and our system uses AI to prevent duplicate listings and make products easily searchable.`,
  },
  {
    question: `How do I start selling on ${project_name}?`,
    answer:
      "Getting started is simple! Click the web link to create your seller account, then start uploading products by sending photos and details to the ${project_name} bot on WhatsApp. The AI will help you add product names, prices, and descriptions. No technical knowledge required!",
  },
  {
    question: `Is ${project_name} really free to use?`,
    answer:
      "Yes! ${project_name} is completely free to use. There are no hidden fees, subscriptions, or monthly charges. You only pay when you successfully complete a sale through transaction fees.",
  },
  {
    question: `How secure are payments on ${project_name}?`,
    answer:
      "Payments are processed securely through Paystack, a trusted payment gateway. We use end-to-end encryption and never store sensitive payment information. After successful payment, customers receive a digital receipt image via WhatsApp for their records.",
  },
  {
    question: `What if I need help or have issues?`,
    answer:
      "Our AI bot provides intelligent customer support and can automatically escalate complex issues to human agents. You can also contact our support team directly through WhatsApp. We're here to help you succeed!",
  },
  {
    question: `Can I manage multiple stores on ${project_name}?`,
    answer:
      `Yes! ${project_name} supports multi-store management. You can run multiple stores from a single WhatsApp account, each with its own product catalog, inventory, and analytics. Perfect for businesses with different product lines or locations.`,
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
          <a href="#" className="text-brand-primary hover:text-brand-dark font-semibold ml-1">
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
