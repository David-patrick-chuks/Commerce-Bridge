"use client"

import { motion } from "framer-motion"
import { Check, Star, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for testing the waters",
    icon: Zap,
    features: [
      "Up to 100 conversations/month",
      "Basic AI responses",
      "WhatsApp integration",
      "Email support",
      "Basic analytics",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "per month",
    description: "For growing businesses",
    icon: Star,
    features: [
      "Unlimited conversations",
      "Advanced AI with custom training",
      "Multi-agent support",
      "Priority support",
      "Advanced analytics & insights",
      "Custom integrations",
      "Automated workflows",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large organizations",
    icon: Crown,
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom AI model training",
      "White-label solution",
      "SLA guarantees",
      "Advanced security features",
      "Custom integrations",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <Star className="w-4 h-4" />
          <span>Simple, Transparent Pricing</span>
        </motion.div>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Choose your growth plan</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Start free and scale as you grow. No hidden fees, no surprises. Cancel or upgrade anytime.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
              plan.popular
                ? "border-red-200 bg-gradient-to-br from-red-50 to-pink-50 shadow-xl scale-105"
                : "border-gray-200 bg-white hover:border-red-200 hover:shadow-lg"
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            {plan.popular && (
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Badge className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-1 text-sm font-semibold">
                  Most Popular
                </Badge>
              </motion.div>
            )}

            <div className="text-center mb-8">
              <motion.div
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  plan.popular ? "bg-gradient-to-r from-red-600 to-red-500 text-white" : "bg-gray-100 text-gray-600"
                }`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <plan.icon className="w-8 h-8" />
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-gray-600 ml-2">/{plan.period}</span>}
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <motion.li
                  key={featureIndex}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * featureIndex }}
                >
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className={`w-full py-3 text-lg font-semibold rounded-xl ${
                  plan.popular
                    ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="text-gray-600 mb-4">All plans include our core features and 24/7 support</p>
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>No setup fees</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
