"use client"

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Star } from "lucide-react";
import { project_name } from '../config';

export default function WhatsAppMockup() {
  return (
    <motion.div
      className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto border border-gray-100"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* WhatsApp Header */}
      <motion.div
        className="bg-[#075e54] text-white p-4 rounded-t-2xl flex items-center space-x-3 -mx-6 -mt-6 mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <MessageCircle className="w-6 h-6 text-red-600" />
        </motion.div>
        <div>
          <p className="font-semibold">{project_name} Bot</p>
          <motion.p
            className="text-xs opacity-90"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Online • AI Assistant
          </motion.p>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="space-y-4 min-h-[400px]">
        <motion.div
          className="bg-gray-100 p-3 rounded-2xl rounded-tl-md max-w-[85%]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-gray-800">
            👋 Hi! I'm {project_name}, your AI shopping assistant. What are you looking for today?
          </p>
        </motion.div>

        <motion.div
          className="bg-red-100 p-3 rounded-2xl rounded-tr-md max-w-[85%] ml-auto"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-sm text-gray-800">I need a new phone case</p>
        </motion.div>

        <motion.div
          className="bg-gray-100 p-3 rounded-2xl rounded-tl-md max-w-[85%]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <p className="text-sm text-gray-800 mb-3">Great! I found some popular phone cases for you:</p>

          {/* Product Cards */}
          <div className="space-y-2">
            {[
              { name: "Clear Case Pro", price: "$25", rating: "4.8" },
              { name: "Leather Wallet Case", price: "$45", rating: "4.9" },
            ].map((product, index) => (
              <motion.div
                key={index}
                className="bg-white p-3 rounded-lg border border-gray-200"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.3 + index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-xs text-gray-900">{product.name}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 text-sm">{product.price}</p>
                    <motion.button
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs mt-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Buy
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-red-100 p-3 rounded-2xl rounded-tr-md max-w-[85%] ml-auto"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.7 }}
        >
          <p className="text-sm text-gray-800">I'll take the Clear Case Pro!</p>
        </motion.div>

        <motion.div
          className="bg-gray-100 p-3 rounded-2xl rounded-tl-md max-w-[85%]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.9 }}
        >
          <p className="text-sm text-gray-800">
            Perfect! 🎉 Processing your order for Clear Case Pro ($25). You'll receive payment details shortly.
          </p>
        </motion.div>
      </div>

      {/* Input Area */}
      <motion.div
        className="bg-gray-50 p-3 rounded-2xl flex items-center space-x-2 mt-4 -mx-6 -mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.1 }}
      >
        <div className="flex-1 bg-white rounded-full px-4 py-2">
          <motion.p
            className="text-sm text-gray-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Type a message...
          </motion.p>
        </div>
        <motion.div
          className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
