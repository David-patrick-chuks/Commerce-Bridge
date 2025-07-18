"use client"

import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { project_name } from '../config'

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    content:
      `${project_name} transformed my business! I can now sell directly through WhatsApp without any technical setup. My sales increased by 300% in just 2 months.`,
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Customer",
    content:
      "Shopping through WhatsApp is so convenient! No apps to download, just chat and buy. The AI bot understands exactly what I need.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Priya Patel",
    role: "E-commerce Seller",
    content:
      "The analytics and seller tools are incredible. I can manage my entire store through WhatsApp messages. It's the future of e-commerce!",
    rating: 5,
    avatar: "PP",
  },
  {
    name: "David Rodriguez",
    role: "Tech Enthusiast",
    content:
      "I was skeptical at first, but {project_name}'s AI is impressive. It handles complex orders, payments, and customer service seamlessly.",
    rating: 5,
    avatar: "DR",
  },
]

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                >
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                </motion.div>
              ))}
            </div>

            <motion.blockquote
              className="text-2xl text-gray-800 font-medium mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              "{testimonials[currentIndex].content}"
            </motion.blockquote>

            <motion.div
              className="flex items-center justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
                whileHover={{ scale: 1.1 }}
              >
                {testimonials[currentIndex].avatar}
              </motion.div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-lg">{testimonials[currentIndex].name}</p>
                <p className="text-gray-600">{testimonials[currentIndex].role}</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="rounded-full bg-white/80 backdrop-blur-sm border-green-200 hover:bg-green-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="rounded-full bg-white/80 backdrop-blur-sm border-green-200 hover:bg-green-50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-green-600" : "bg-gray-300"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  )
}
