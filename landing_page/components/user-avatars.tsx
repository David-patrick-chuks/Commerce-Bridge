"use client"

import { motion } from "framer-motion"

export default function UserAvatars() {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex -space-x-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <motion.div
            key={i}
            className="w-12 h-12 rounded-full bg-white border-2 border-brand-accent flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.1 }}
          >
            <span className="text-brand-primary font-bold text-sm">{String.fromCharCode(64 + i)}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
