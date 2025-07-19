"use client"

import StatsSection from "@/components/stats-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import WhatsAppDemo from "@/components/whatsapp-demo"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown, MessageCircle, Play, Shield, Sparkles, TrendingUp, Zap } from "lucide-react"
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
    <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
      <motion.div
        className="container mx-auto px-6 lg:px-8"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <motion.div
          className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <div className="max-w-2xl">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Badge
                variant="secondary"
                className="mb-8 bg-gradient-to-r from-brand-light to-emerald-50 text-brand-primary border-brand-accent/50 hover:bg-brand-light px-4 py-2 text-sm font-medium"
              >
                <motion.div
                  className="w-2 h-2 bg-brand-primary rounded-full mr-3"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
                <Sparkles className="w-4 h-4 mr-2" />
                Now in beta • Join 50,000+ early users
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-8"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              The Future of{" "}
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
                Commerce
              </motion.span>{" "}
              is Conversational
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed"
              {...fadeInUp}
              transition={{ delay: 0.3 }}
            >
              Transform your business with AI-powered WhatsApp commerce.
              <span className="text-brand-primary font-semibold"> No apps, no websites</span> — just intelligent
              conversations that convert browsers into buyers.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 mb-12" {...fadeInUp} transition={{ delay: 0.4 }}>
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
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white shadow-xl px-8 py-4 text-lg font-semibold rounded-full"
                  onClick={() => window.open('https://wa.me/2347081643714', '_blank')}
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Start Free Today
                  <motion.div
                    className="ml-3"
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-full bg-white/80 backdrop-blur-sm"
                >
                  <Play className="w-5 h-5 mr-3" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            <StatsSection />

            {/* Trust indicators */}
            <motion.div
              className="flex items-center space-x-6 mt-12 text-sm text-gray-500"
              {...fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>5-min setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>100% free platform</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-3xl blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <WhatsAppDemo />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        whileHover={{ scale: 1.2 }}
      >
        <ChevronDown className="w-6 h-6 text-gray-400" />
      </motion.div>
    </section>
  )
} 