"use client"

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { project_name } from '../config';

const testimonials = [
  {
    content:
      `${project_name} transformed how we sell. Our WhatsApp sales increased by 300% in just two months. The AI handles everything seamlessly.`,
    author: "Sarah Chen",
    role: "Founder, StyleHub",
    avatar: "SC",
  },
  {
    content:
      "The analytics dashboard gives us insights we never had before. Understanding customer behavior through chat data is game-changing.",
    author: "Michael Rodriguez",
    role: "E-commerce Manager, TechStore",
    avatar: "MR",
  },
  {
    content:
      "Setup was incredibly easy. Within hours, we had a fully functional WhatsApp store with AI assistance. Our customers love it.",
    author: "Priya Patel",
    role: "Owner, Local Grocers",
    avatar: "PP",
  },
]

export default function TestimonialSection() {
  return (
    <div>
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trusted by businesses worldwide</h2>
        <p className="text-xl text-gray-600">See what our customers are saying about their experience with {project_name}.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                {testimonial.avatar}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
