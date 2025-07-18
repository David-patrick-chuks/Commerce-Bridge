"use client"

import { motion } from "framer-motion"
import { MessageCircle, Shield, BarChart3, Zap, Users, Star } from "lucide-react"

const features = [
  {
    icon: MessageCircle,
    title: "WhatsApp Native",
    description: "Built specifically for WhatsApp with native chat interfaces and seamless user experience.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "End-to-end encrypted transactions with multiple payment gateways and fraud protection.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive insights into sales, customer behavior, and business performance metrics.",
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "Intelligent chatbot handles customer queries, product recommendations, and order processing.",
  },
  {
    icon: Users,
    title: "Multi-vendor",
    description: "Support for multiple sellers with individual storefronts and inventory management.",
  },
  {
    icon: Star,
    title: "Review System",
    description: "Built-in rating and review system to build trust and improve product quality.",
  },
]

export default function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors duration-300">
            <feature.icon className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-600 leading-relaxed">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  )
}
