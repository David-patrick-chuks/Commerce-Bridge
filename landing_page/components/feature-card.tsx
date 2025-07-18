"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
  delay: number
}

export default function FeatureCard({ icon: Icon, title, description, color, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        rotateY: 5,
      }}
      className="group cursor-pointer"
    >
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
        <motion.div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center mb-6`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">{title}</h3>

        <p className="text-gray-600 leading-relaxed">{description}</p>

        <motion.div
          className="mt-6 w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          transition={{ delay: delay + 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.div>
  )
}
