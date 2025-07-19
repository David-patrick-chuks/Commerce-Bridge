"use client"

import ProductLogo from "@/components/product-logo"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { project_name } from '../config'

interface NavigationProps {
  isScrolled: boolean
}

export default function Navigation({ isScrolled }: NavigationProps) {
  return (
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
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ProductLogo className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {project_name}
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {["Features", "How it works", "Support"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-all duration-300 relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -2 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all duration-300" />
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
                className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white shadow-lg border-0"
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
  )
} 