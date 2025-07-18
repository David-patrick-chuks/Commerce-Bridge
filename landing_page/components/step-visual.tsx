"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface StepVisualProps {
  step: string
  title: string
  description: string
  icon: LucideIcon
  side: "left" | "right"
  index: number
}

export default function StepVisual({ step, title, description, icon: Icon, side, index }: StepVisualProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      className={`flex items-center mb-16 ${side === "right" ? "flex-row-reverse" : ""}`}
    >
      <div className={`flex-1 ${side === "right" ? "text-right pl-12" : "pr-12"}`}>
        <motion.div
          className="text-8xl font-bold text-green-100 mb-4"
          whileHover={{ scale: 1.1, color: "#22c55e" }}
          transition={{ duration: 0.3 }}
        >
          {step}
        </motion.div>

        <h3 className="text-3xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 text-lg leading-relaxed max-w-md">{description}</p>
      </div>

      <motion.div
        className="relative flex-shrink-0"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(34, 197, 94, 0.4)",
              "0 0 0 20px rgba(34, 197, 94, 0)",
              "0 0 0 0 rgba(34, 197, 94, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.5,
          }}
        >
          <Icon className="w-12 h-12 text-white" />
        </motion.div>

        {/* Connecting line */}
        {index < 3 && (
          <motion.div
            className="absolute top-32 left-1/2 w-1 h-16 bg-gradient-to-b from-green-300 to-transparent transform -translate-x-1/2"
            initial={{ height: 0 }}
            whileInView={{ height: 64 }}
            transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
            viewport={{ once: true }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
