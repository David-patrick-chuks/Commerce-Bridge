"use client"

import ProductLogo from "@/components/product-logo"
import { motion } from "framer-motion"
import { MessageCircle, Shield, TrendingUp } from "lucide-react"
import { project_name } from '../config'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-20">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3">
              <ProductLogo className="w-10 h-10 text-brand-accent" />
              <span className="text-2xl font-bold">{project_name}</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg">
              The first AI-powered WhatsApp marketplace. Making e-commerce as simple as sending a message.
            </p>
            <div className="flex space-x-4">
              {[MessageCircle, TrendingUp, Shield].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-accent hover:bg-gray-700 transition-all duration-300"
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
              title: "Platform",
              links: ["How it works", "Features", "Security"],
            },
            {
              title: "Support",
              links: ["Help Center", "Contact Us", "WhatsApp Support"],
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
                      className="text-gray-400 hover:text-brand-accent transition-colors duration-300"
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
            © 2024 {project_name}. All rights reserved. Made with ❤️ for the future of commerce.
          </p>
          <div className="flex items-center space-x-8 mt-4 md:mt-0">
            {["Privacy", "Terms"].map((item) => (
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
  )
} 