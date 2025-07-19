"use client"

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhatsAppDemo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex justify-center items-center"
    >
      <Image
        src="/images/whatsapp-screen.png"
        alt="WhatsApp commerce interface showing product browsing and shopping"
        width={400}
        height={800}
        className="w-auto h-auto object-cover max-w-md lg:max-w-lg xl:max-w-xl"
        priority
      />
    </motion.div>
  )
}
