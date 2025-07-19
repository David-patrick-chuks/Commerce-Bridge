"use client"

import FAQSection from "@/components/faq-section"
import FeatureGrid from "@/components/feature-grid"
import IntegrationShowcase from "@/components/integration-showcase"
import ProcessSteps from "@/components/process-steps"
import TestimonialSection from "@/components/testimonial-section"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { project_name } from '../config'

// Import new components
import BackgroundElements from "@/components/background-elements"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import Navigation from "@/components/navigation"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <BackgroundElements />

      {/* Navigation */}
      <Navigation isScrolled={isScrolled} />

      {/* Hero Section */}
      <HeroSection />

      {/* Integration Showcase */}
      <section className="py-16 bg-gray-50/50">
        <IntegrationShowcase />
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-brand-light text-brand-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to dominate
              <br />
              <span className="text-brand-primary">{project_name}</span>
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
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              From setup to success in
              <span className="text-brand-primary"> 3 simple steps</span>
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
        <div className="container mx-auto px-6 lg:px-8">
          <TestimonialSection />
        </div>
      </section>

      {/* FAQ */}
      <section id="support" className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <FAQSection />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
