"use client"

import { motion } from "framer-motion"

interface ProductIconProps {
  className?: string
}

export default function ProductIcon({ className = "w-8 h-8" }: ProductIconProps) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {/* Main chat bubble */}
      <motion.path
        d="M25 20 C25 12, 32 5, 40 5 L75 5 C83 5, 90 12, 90 20 L90 50 C90 58, 83 65, 75 65 L45 65 L30 75 L30 65 L25 65 C17 65, 10 58, 10 50 L10 30 C10 22, 17 15, 25 15 Z"
        fill="currentColor"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />

      {/* AI dots */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <motion.circle
          cx="35"
          cy="35"
          r="3"
          fill="white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
        />
        <motion.circle
          cx="50"
          cy="35"
          r="3"
          fill="white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
        />
        <motion.circle
          cx="65"
          cy="35"
          r="3"
          fill="white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
        />
      </motion.g>

      {/* Shopping bag icon */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }}>
        <rect x="70" y="70" width="20" height="15" rx="2" fill="currentColor" opacity="0.8" />
        <path
          d="M75 70 C75 65, 80 65, 80 65 C80 65, 85 65, 85 70"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />
      </motion.g>
    </motion.svg>
  )
}
