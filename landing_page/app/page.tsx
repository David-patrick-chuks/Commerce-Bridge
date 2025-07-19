"use client"

import FAQSection from "@/components/faq-section"
import FeatureGrid from "@/components/feature-grid"
import IntegrationShowcase from "@/components/integration-showcase"
import ProcessSteps from "@/components/process-steps"
import ProductLogo from "@/components/product-logo"
import StatsSection from "@/components/stats-section"
import TestimonialSection from "@/components/testimonial-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import WhatsAppDemo from "@/components/whatsapp-demo"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown, MessageCircle, Play, Shield, Sparkles, TrendingUp, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { project_name } from '../config'

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

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      x.set(e.clientX / window.innerWidth - 0.5)
      y.set(e.clientY / window.innerHeight - 0.5)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [x, y])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
          style={{
            x: useTransform(x, [-0.5, 0.5], [-50, 50]),
            y: useTransform(y, [-0.5, 0.5], [-50, 50]),
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-2xl border-b border-gray-100/50 shadow-lg shadow-gray-900/5"
            : "bg-transparent"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ProductLogo className="w-8 h-8  text-green-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {project_name}
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {["Features", "How it works", "Support"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-sm font-medium text-gray-600 hover:text-green-600 transition-all duration-300 relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg border-0"
                  onClick={() => window.open('https://wa.me/2347081643714', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get started
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        <motion.div
          className="max-w-7xl mx-auto px-6 lg:px-8"
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
                  className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200/50 hover:bg-green-100 px-4 py-2 text-sm font-medium"
                >
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full mr-3"
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
                  className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent"
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
                <span className="text-green-600 font-semibold"> No apps, no websites</span> — just intelligent
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
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-xl px-8 py-4 text-lg font-semibold rounded-full"
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

      {/* Integration Showcase */}
      <section className="py-16 bg-gray-50/50">
        <IntegrationShowcase />
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to dominate
              <br />
              <span className="text-green-600">{project_name}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From AI-powered conversations to advanced analytics, {project_name} provides enterprise-grade tools that scale with
              your business ambitions.
            </p>
          </motion.div>

          <FeatureGrid />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              From setup to success in
              <span className="text-green-600"> 3 simple steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our streamlined onboarding gets you selling in minutes, not hours. Join thousands of businesses already
              thriving on WhatsApp.
            </p>
          </motion.div>

          <ProcessSteps />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <TestimonialSection />
        </div>
      </section>

      {/* FAQ */}
      <section id="support" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FAQSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-green-600 via-green-500 to-green-600 relative overflow-hidden">
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

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
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
                  className="bg-white text-green-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-full shadow-xl"
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
                  className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-10 py-4 text-lg font-semibold rounded-full bg-transparent backdrop-blur-sm"
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3">
                <ProductLogo className="w-10 h-10 text-green-400" />
                <span className="text-2xl font-bold">{project_name}</span>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                Revolutionizing commerce through intelligent WhatsApp conversations. Built for the future of business.
              </p>
              <div className="flex space-x-4">
                {[MessageCircle, TrendingUp, Shield].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {[
              {
                title: "Product",
                links: ["Features", "API", "Integrations", "Security", "Enterprise"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press", "Partners", "Investors"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact", "Status", "Community", "Documentation", "Tutorials"],
              },
            ].map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                        whileHover={{ x: 4 }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-400 text-sm">
              © 2024 {project_name} Technologies Inc. All rights reserved. Made with ❤️ for the future of commerce.
            </p>
            <div className="flex items-center space-x-8 mt-4 md:mt-0">
              {["Privacy", "Terms", "Cookies", "GDPR"].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
