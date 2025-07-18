"use client"

import { motion } from "framer-motion"
import { MessageCircle, ShoppingCart, Star, Zap } from "lucide-react"

const bubbles = [
  { Icon: MessageCircle, delay: 0, x: "10%", y: "20%", color: "text-green-300" },
  { Icon: ShoppingCart, delay: 2, x: "85%", y: "15%", color: "text-emerald-300" },
  { Icon: Star, delay: 4, x: "15%", y: "70%", color: "text-yellow-300" },
  { Icon: Zap, delay: 6, x: "80%", y: "75%", color: "text-blue-300" },
  { Icon: MessageCircle, delay: 8, x: "5%", y: "50%", color: "text-purple-300" },
  { Icon: ShoppingCart, delay: 10, x: "90%", y: "45%", color: "text-pink-300" },
]

export default function FloatingChatBubbles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bubbles.map(({ Icon, delay, x, y, color }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color}`}
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            y: [0, -20, 0],
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
              rotate: [0, -10, 10, 0],
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
