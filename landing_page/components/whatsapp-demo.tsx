"use client"

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhatsAppDemo() {
  return (
    <motion.div
      className="relative max-w-sm mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Image
        src="/images/whatsapp-screen.png"
        alt="WhatsApp commerce interface showing product browsing and shopping"
        width={320}
        height={640}
        className="w-full h-auto object-cover rounded-2xl shadow-2xl"
        priority
      />
    </motion.div>
  )
}
