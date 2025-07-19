"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, MessageCircle, Play, TrendingUp } from "lucide-react"

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

export default function CTASection() {
  return (
    <section className="py-32 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Join 50,000+ successful businesses</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to boost your sales for free?</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses using our free WhatsApp commerce platform. No hidden fees, no subscriptions — 
            just like Jumia, we make money when you make money.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeInUp}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-white text-brand-primary hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-full shadow-xl"
                onClick={() => window.open('https://wa.me/2347081643714', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Start Free Today
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-brand-primary px-10 py-4 text-lg font-semibold rounded-full bg-transparent backdrop-blur-sm"
                onClick={() => window.open('https://wa.me/2347081643714?text=Hi! I would like to book a demo of your platform.', '_blank')}
              >
                <Play className="w-5 h-5 mr-3" />
                Book Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            className="text-green-100 text-sm mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            ✨ Setup in 5 minutes • 💳 Completely free • 🚀 No hidden fees
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
} 