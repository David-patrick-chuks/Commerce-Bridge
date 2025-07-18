# About Taja 🛍️

Welcome to Taja, the first AI-powered WhatsApp-first marketplace. Our mission is to make e-commerce as simple as sending a WhatsApp message, empowering small and medium businesses (SMBs) to thrive without the need for complex websites or apps.

## 🎯 The Vision

We believe technology should be accessible to everyone. Taja was created so that anyone who can use WhatsApp can run a successful online store. Our goal is a world where starting and managing a business is intuitive, conversational, and available to all.

Our vision is a complete "in-chat" commerce ecosystem, where:
- **Customers** discover, browse, and buy products through a natural conversation with a smart AI bot.
- **Sellers** manage their business—from product uploads to analytics—using simple WhatsApp commands.

## 🚀 What is Taja?

Taja is a WhatsApp-first e-commerce platform. Customers and sellers interact entirely through a state-machine-driven, NLP-powered chatbot. The only web interface is for onboarding and account creation; all shopping, order management, and support happen in WhatsApp.

### Key Features for Customers
- **Conversational Shopping**: Browse, search, and purchase products by chatting with the bot.
- **AI-Powered Image Search**: Upload a product image and the bot finds visually similar items using advanced AI.
- **Seamless Checkout**: Add to cart, pay securely via Paystack, and receive a digital receipt image—all in WhatsApp.
- **Order Tracking & Support**: Get real-time order updates and escalate to a human agent if needed.
- **Multi-language & Accessibility**: Chat in your preferred language; all messages and images are screen reader-friendly.

### Key Features for Sellers
- **Effortless Product Management**: Upload products, update inventory, and change prices by sending messages and images to the bot.
- **AI-Powered Product Matching**: Prevents duplicate listings and makes products easily searchable.
- **Sales Analytics & Alerts**: Receive sales snapshots and inventory alerts via WhatsApp.
- **Promotional Broadcasts**: Send opt-in promotions to your customer list.
- **Multi-store Management**: Manage multiple stores from a single WhatsApp account.
- **Verified Business Badges**: Build trust with customers.

## 🛠️ How It Works: The Technology

Taja is built on a modern, modular, and secure stack:

### Core Components
- **WhatsApp Bot (Node.js, WhatsApp Web JS)**: Handles all user interactions, conversation flows (as state machines), and session management.
- **AI/Model Server (Python, FastAPI)**: Powers image search and product matching using OpenAI CLIP and hybrid RAG search. All image/video/text search is async and job-based.
- **Web Onboarding (React, Vite)**: Simple web interface for account creation and onboarding only.
- **Payments (Paystack)**: Secure, verified payment processing with webhook handling and digital receipt generation.
- **Databases**: PostgreSQL for structured data (orders, users), MongoDB Atlas for product catalog and vector search.
- **Seller Tools**: Broadcasts, analytics, and multi-store management modules.
- **Compliance & Privacy**: End-to-end encryption, GDPR/CCPA compliance, privacy controls, and regular security audits.

### Architecture Overview
```
+---------------------+      +---------------------+      +---------------------+
|      Customer       |      |       Seller        |      |   Web Onboarding    |
| (WhatsApp)          |      | (WhatsApp)          |      | (React)             |
+---------------------+      +---------------------+      +---------------------+
          |                            |                            |
          |                            |                            |
+-----------------------------------------------------------------------------+
|                                WhatsApp Bot                                 |
|                    (Node.js, Express, WhatsApp Web JS, State Machine)       |
+-----------------------------------------------------------------------------+
          |                            |                            |
          |                            |                            |
+---------------------+      +---------------------+      +---------------------+
|  Primary Database   |      |   AI/ML Server      |      |   Vector Database   |
| (PostgreSQL)        |      | (Python, FastAPI, CLIP) |      | (MongoDB Atlas)     |
+---------------------+      +---------------------+      +---------------------+
```

## 🤝 Join the Taja Community

Whether you're a business owner, developer, or just love conversational commerce, join us:
- **Discord**: [Join our community](https://discord.gg/taja)
- **Support**: [Contact WhatsApp Support](https://wa.me/{{WHATSAPP_OFFICIAL_NUMBER}})
- **Docs**: [docs.taja.ai](https://docs.taja.ai)
- **Contribute**: We welcome PRs and feedback—see our `README.md` to get started.

Thank you for your interest in Taja. We're excited to build the future of WhatsApp commerce with you! 