# 🩺 Cura AI – Your Personal AI Health Assistant

Cura AI is an AI-powered healthcare platform designed to make personal health management easier and smarter. It helps users track their health information, manage symptoms and medications, monitor mental wellness, and interact with an AI-powered health assistant.

Built with modern web technologies and Google Gemini AI, Cura AI aims to provide a simple and user-friendly healthcare experience.

## 🌟 Key Features

- **AI Health Assistant:** Chat with an AI-powered assistant to get health-related information and general guidance.
- **Health Tracking:** Keep track of personal health details and health-related information.
- **Symptom Management:** Add and manage symptoms to maintain a record of your health.
- **Medication Management:** Store and manage medication information.
- **Mental Wellness:** Maintain records related to mental well-being.
- **Secure Authentication:** Sign in and manage your account securely using Clerk.
- **Personalized Experience:** Get AI assistance using relevant health information provided in your account.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **Authentication:** Clerk
- **Database:** MongoDB
- **ORM:** Prisma
- **AI Integration:** Google Gemini API
- **State Management & Data Fetching:** Zustand, TanStack Query
- **UI & Animations:** Framer Motion, Lucide React

## 🚀 Getting Started

Follow these steps to run Cura AI on your local machine.

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd cura-main
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Database
DATABASE_URL=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Google Gemini AI
GOOGLE_API_KEY=
```

Add your own credentials from MongoDB, Clerk, and Google AI Studio.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Sync Database Schema

```bash
npx prisma db push
```

### 6. Start the Development Server

```bash
pnpm dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## 📖 How to Use Cura AI

1. **Create an Account:** Sign up or log in using the authentication system.
2. **Complete Your Profile:** Enter the required personal and health-related information.
3. **Explore Your Dashboard:** Access your health information and available features.
4. **Manage Your Health:** Add symptoms, medications, and mental wellness information.
5. **Chat with Cura AI:** Open the AI assistant and ask health-related questions.
6. **Review Your Information:** Use your dashboard to keep track of the information you have added.

## ⚠️ Disclaimer

Cura AI is designed for general health information and wellness assistance. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.

## 📄 License

This project is licensed under the MIT License.

## 👩‍💻 Created By

**Shravani Desai | Samruddhi | Astha**

Computer Engineering Students

Built with ❤️ to make healthcare assistance smarter and more accessible.