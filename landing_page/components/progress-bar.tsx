"use client"

import { motion, useSpring, type MotionValue } from "framer-motion"

interface ProgressBarProps {
  progress: MotionValue<number>
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const scaleX = useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary origin-left z-50"
      style={{ scaleX }}
    />
  )
}
