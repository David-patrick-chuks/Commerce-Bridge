"use client"

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { project_name } from '../config';

const testimonials = [
  {
    content:
      `${project_name} made selling online so simple. I just send product photos to the bot and customers can find them by uploading similar images. No website needed!`,
    author: "Sarah Chen",
    role: "Fashion Seller",
    avatar: "SC",
  },
  {
    content:
      `I love shopping on ${project_name}! I just upload a photo of what I want, and the AI finds similar products. It's so much easier than browsing websites.`,
    author: "David Kim",
    role: "Customer",
    avatar: "DK",
  },
  {
    content:
      "The AI image search is amazing. Customers upload a photo of what they want, and the bot finds similar products in my catalog. It's like magic!",
    author: "Michael Rodriguez",
    role: "Electronics Store Owner",
    avatar: "MR",
  },
  {
    content:
      "Setup was incredibly easy. I just clicked a link to create my account, then started uploading products through WhatsApp. My customers love shopping through chat.",
    author: "Priya Patel",
    role: "Local Grocery Owner",
    avatar: "PP",
  },
  {
    content:
      "Shopping through WhatsApp is so convenient! I can browse, ask questions, and buy without leaving the chat. The AI assistant is really helpful.",
    author: "Emma Wilson",
    role: "Customer",
    avatar: "EW",
  },
  {
    content:
      "Running my store through WhatsApp is perfect for my small business. I can manage everything from my phone, and customers love the personal touch.",
    author: "Ahmed Hassan",
    role: "Home Decor Seller",
    avatar: "AH",
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
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Loved by sellers and customers</h2>
        <p className="text-xl text-gray-600">See what our community is saying about their experience with {project_name}.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
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
