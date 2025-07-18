"use client"

import { motion } from "framer-motion"
import { MessageCircle, ShoppingCart, Star, Zap, Heart, Gift } from "lucide-react"

const elements = [
  { Icon: MessageCircle, delay: 0, x: "10%", y: "20%", color: "text-red-300" },
  { Icon: ShoppingCart, delay: 2, x: "85%", y: "15%", color: "text-red-400" },
  { Icon: Star, delay: 4, x: "15%", y: "70%", color: "text-red-200" },
  { Icon: Zap, delay: 6, x: "80%", y: "75%", color: "text-red-500" },
  { Icon: Heart, delay: 8, x: "5%", y: "50%", color: "text-red-300" },
  { Icon: Gift, delay: 10, x: "90%", y: "45%", color: "text-red-400" },
]

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map(({ Icon, delay, x, y, color }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color}`}
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            delay: delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{
              rotate: [0, -15, 15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
