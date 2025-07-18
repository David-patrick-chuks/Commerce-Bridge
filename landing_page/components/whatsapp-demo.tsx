"use client"

import { motion } from "framer-motion";
import { ArrowRight, Check, MessageCircle, Star } from "lucide-react";
import { project_name } from '../config';

export default function WhatsAppDemo() {
  return (
    <motion.div
      className="relative max-w-sm mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Phone frame */}
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-white rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="bg-gray-100 px-6 py-2 flex items-center justify-between text-xs font-medium text-gray-900">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 bg-gray-900 rounded-sm" />
            </div>
          </div>

          {/* WhatsApp header */}
          <div className="bg-[#075e54] text-white px-4 py-3 flex items-center space-x-3">
            <ArrowRight className="w-5 h-5 rotate-180" />
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-sm">{project_name}</p>
              <p className="text-xs opacity-80">Online</p>
            </div>
          </div>

          {/* Chat content */}
          <div className="bg-[#e5ddd5] p-4 h-96 overflow-hidden">
            <div className="space-y-3">
              {/* Bot message */}
              <motion.div
                className="bg-white p-3 rounded-lg max-w-[80%] shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-gray-800">
                  Hi! 👋 I'm your AI shopping assistant. What can I help you find today?
                </p>
              </motion.div>

              {/* User message */}
              <motion.div
                className="bg-[#dcf8c6] p-3 rounded-lg max-w-[80%] ml-auto shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm text-gray-800">Looking for wireless headphones</p>
              </motion.div>

              {/* Product suggestions */}
              <motion.div
                className="bg-white p-3 rounded-lg max-w-[85%] shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <p className="text-sm text-gray-800 mb-3">Great! Here are some popular options:</p>

                <div className="space-y-2">
                  {[
                    { name: "AirPods Pro", price: "$249", rating: 4.8 },
                    { name: "Sony WH-1000XM4", price: "$349", rating: 4.9 },
                  ].map((product, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-50 p-2 rounded border"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-xs">{product.name}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600 text-sm">{product.price}</p>
                          <button className="bg-red-600 text-white px-2 py-1 rounded text-xs mt-1">Buy</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Order confirmation */}
              <motion.div
                className="bg-[#dcf8c6] p-3 rounded-lg max-w-[80%] ml-auto shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 }}
              >
                <p className="text-sm text-gray-800">I'll take the AirPods Pro!</p>
              </motion.div>

              <motion.div
                className="bg-white p-3 rounded-lg max-w-[85%] shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 }}
              >
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-gray-800">Order confirmed! Payment link sent.</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Input area */}
          <div className="bg-gray-100 p-3 flex items-center space-x-2">
            <div className="flex-1 bg-white rounded-full px-4 py-2">
              <p className="text-sm text-gray-500">Type a message...</p>
            </div>
            <div className="w-8 h-8 bg-[#25d366] rounded-full flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
