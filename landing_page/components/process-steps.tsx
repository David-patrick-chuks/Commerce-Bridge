"use client"

import { motion } from "framer-motion"
import { CreditCard, MessageCircle, ShoppingCart } from "lucide-react"

const steps = [
  {
    icon: MessageCircle,
    title: "Start Conversation",
    description: "Customer messages your WhatsApp business number to browse products and ask questions.",
  },
  {
    icon: ShoppingCart,
    title: "Browse & Select",
    description: "AI assistant shows products, handles queries, and helps customers make informed decisions.",
  },
  {
    icon: CreditCard,
    title: "Complete Purchase",
    description: "Secure payment processing with instant confirmation and order tracking.",
  },
]

export default function ProcessSteps() {
  return (
    <div className="relative">
      {/* Connection line */}
      <div className="hidden lg:block absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
        <div className="relative h-0.5 bg-gray-200">
          <motion.div
            className="absolute inset-0 bg-brand-primary"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="text-center relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="relative inline-flex items-center justify-center w-16 h-16 bg-brand-primary rounded-full mb-6 shadow-lg">
              <step.icon className="w-8 h-8 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-brand-primary">{index + 1}</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
