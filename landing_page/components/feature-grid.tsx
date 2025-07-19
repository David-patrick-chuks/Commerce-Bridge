"use client"

import { motion } from "framer-motion"
import { Image, MessageCircle, Shield, Star, Users, Zap } from "lucide-react"

const features = [
  {
    icon: MessageCircle,
    title: "WhatsApp-First",
    description: "Complete e-commerce experience through WhatsApp chat. No website or app needed - everything happens in conversations.",
  },
  {
    icon: Image,
    title: "AI Multi-Media Search",
    description: "Upload product images, videos, or use text queries to find items using AI. Customers can search by uploading photos/videos or describing what they want.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "End-to-end encrypted transactions through Paystack. Digital receipts sent via WhatsApp after successful payments.",
  },
  {
    icon: Zap,
    title: "Smart AI Bot",
    description: "Intelligent chatbot handles product browsing, search, payments, and order management through natural conversations.",
  },
  {
    icon: Users,
    title: "Multi-Store Support",
    description: "Manage multiple stores from a single WhatsApp account. Perfect for businesses with different product lines.",
  },
  {
    icon: Star,
    title: "Simple Setup",
    description: "Get started in minutes. Just click a link to create your account, then start uploading products through WhatsApp.",
  },
]

export default function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-brand-accent hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors duration-300">
            <feature.icon className="w-6 h-6 text-brand-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-600 leading-relaxed">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  )
}
