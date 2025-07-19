"use client"

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhatsAppMockup() {
  return (
    <motion.div
      className="max-w-sm mx-auto"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
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
