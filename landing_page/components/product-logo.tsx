"use client"

import { motion } from "framer-motion"

interface ProductLogoProps {
  className?: string
}

export default function ProductLogo({ className = "w-8 h-8" }: ProductLogoProps) {
  return (
    <motion.div className={`${className} relative`} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>

        {/* Chat bubble */}
        <path
          d="M8 12 C8 8, 12 4, 16 4 L28 4 C32 4, 36 8, 36 12 L36 24 C36 28, 32 32, 28 32 L20 32 L12 36 L12 32 L8 32 C4 32, 0 28, 0 24 L0 16 C0 12, 4 8, 8 8 Z"
          fill="url(#logoGradient)"
        />

        {/* Shopping cart icon */}
        <g fill="white">
          <rect x="14" y="14" width="12" height="8" rx="1" />
          <circle cx="17" cy="26" r="1.5" />
          <circle cx="23" cy="26" r="1.5" />
          <path d="M14 14 L12 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  )
}
