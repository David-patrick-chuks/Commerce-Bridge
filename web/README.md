# Taja Web Client (Account Creation & Onboarding)

> **This is the web client for account creation and onboarding for the Taja WhatsApp commerce platform.**

---

## ✨ Overview
This web app enables new users and sellers to create accounts for Taja via a secure, user-friendly React interface. All core e-commerce and chat happens in WhatsApp, but this client handles onboarding, registration, and initial profile setup.

---

## 🎯 Features
- **Account creation** for customers and sellers
- **WhatsApp deep links** for support and onboarding
- **Responsive, accessible UI**
- **Category selection, profile image upload, and more**
- **Handles expired/invalid invite links gracefully**
- **Modern React + Vite + TypeScript stack**

---

## 🔗 WhatsApp External Links Used
- **WhatsApp Support:**
  - Used for expired/invalid invite links and for user help.
  - Example: `[Contact WhatsApp Support](https://wa.me/{{WHATSAPP_SUPPORT_NUMBER}})`
- **Continue on WhatsApp:**
  - After successful account creation, users are prompted to continue chatting on WhatsApp.
  - Example: `[Continue on WhatsApp](https://wa.me/{{WHATSAPP_SUPPORT_NUMBER}})`
- **WhatsApp Number Variable:**
  - The WhatsApp number is set in the code as `WHATSAPP_OFFICIAL_NUMBER` (e.g., `+2347014185686`).
  - All WhatsApp links are generated as: `https://wa.me/{{WHATSAPP_OFFICIAL_NUMBER}}`

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/taja-web.git
   cd taja-web
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in the API URL and any other required variables.
4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🏗️ Tech Stack
- **React 18**
- **Vite** (build tool)
- **TypeScript**
- **CSS Modules** (for styling)

---

## ⚙️ Environment Variables
- `VITE_API_URL` — The base URL for the backend API (default: `http://localhost:3001`)
- (Add any other variables as needed)

---

## 🗂️ Folder Structure
```
web/
├── src/
│   ├── pages/
│   │   └── create-account.tsx, create-account.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── ...
```

---

## 🤝 Contributing
We welcome contributions! Please open issues or pull requests for improvements.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support
- **WhatsApp**: [Contact Support](https://wa.me/{{WHATSAPP_OFFICIAL_NUMBER}})
- **Email**: support@taja.ai

--- 