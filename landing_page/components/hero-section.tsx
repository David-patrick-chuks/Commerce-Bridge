"use client"

import StatsSection from "@/components/stats-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import WhatsAppDemo from "@/components/whatsapp-demo"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown, MessageCircle, Shield, Sparkles, TrendingUp, Zap } from "lucide-react"
import { useRef } from "react"

const fadeInUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HeroSection() {
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLElement>(null)

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

  return (
    <section ref={heroRef} className="relative pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-32 items-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Badge
                variant="secondary"
                className="mb-6 sm:mb-8 lg:mb-10 bg-gradient-to-r from-brand-light to-emerald-50 text-brand-primary border-brand-accent/50 hover:bg-brand-light px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium"
              >
                <motion.div
                  className="w-2 h-2 bg-brand-primary rounded-full mr-2 sm:mr-3"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                WhatsApp-first commerce platform
              </Badge>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 sm:mb-8 lg:mb-10"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Shop & Sell Through{" "}
              <motion.span
                className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 100%",
                }}
              >
                WhatsApp
              </motion.span>{" "}
              Conversations
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 leading-relaxed"
              {...fadeInUp}
              transition={{ delay: 0.3 }}
            >
              The complete e-commerce experience through intelligent WhatsApp conversations.
              <span className="text-brand-primary font-semibold"> No apps, no websites</span> — just chat, shop, and sell seamlessly.
            </motion.p>

            <motion.div className="mb-12 sm:mb-14 lg:mb-16" {...fadeInUp} transition={{ delay: 0.4 }}>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)",
                  y: -2,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white shadow-xl px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-base sm:text-lg font-semibold rounded-full w-full sm:w-auto"
                  onClick={() => window.open('https://wa.me/2347081643714', '_blank')}
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Start Free Today
                  <motion.div
                    className="ml-2 sm:ml-3"
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>

            <StatsSection />

            {/* Trust indicators */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 mt-12 sm:mt-14 lg:mt-16 text-xs sm:text-sm text-gray-500"
              {...fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Quick setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>Free platform</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="order-first lg:order-last"
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <WhatsAppDemo />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        whileHover={{ scale: 1.2 }}
      >
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
      </motion.div>
    </section>
  )
} 