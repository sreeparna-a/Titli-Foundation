# 🦋 Titli Foundation

**"A Social Responsibility"**

Titli Foundation is an independent cultural community dedicated to bridging the gap between raw artistic expression and social impact. Established with a deep appreciation for the classical and the contemporary, we nurture visionaries in theatre, film, and art. We are a sanctuary for storytellers who dare to push boundaries.

![Titli Banner](https://raw.githubusercontent.com/sreeparna-a/Titli-Foundation/main/frontend/public/logo-rounded.png) *(Note: Placeholder for actual banner if available)*

---

## ✨ Features

- **Cinematic Experience**: A high-end, immersive user interface with smooth scrolling and parallax effects.
- **The Vision**: Interactive storytelling of the foundation's mission and history.
- **Curtain Calls (Events)**: Showcase of past and upcoming productions and activities.
- **The Ensemble (Members)**: Recognition of the creative minds behind the foundation.
- **Archives (Gallery)**: A visual journey through our performances and social initiatives.
- **Say Hello (Contact)**: Seamless communication channel for collaborations and inquiries.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Scrolling**: [Lenis](https://lenis.darkroom.engineering/) for smooth cinematic motion.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Requests**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Mail Service**: [Nodemailer](https://nodemailer.com/)
- **Environment Management**: [Dotenv](https://github.com/motdotla/dotenv)

---

## 📁 Project Structure

```text
Titli-Foundation/
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # UI Components (Hero, About, Sections, etc.)
│   │   ├── assets/         # Images and styles
│   │   └── App.jsx         # Main application logic
│   └── public/             # Static assets
└── backend/                # Express.js server
    ├── src/
    │   ├── controllers/    # Request handlers (e.g., Contact form)
    │   ├── routes/         # API endpoints
    │   └── server.js       # Entry point
    └── .env                # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sreeparna-a/Titli-Foundation.git
   cd Titli-Foundation
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   RECEIVER_EMAIL=titli.foundation@example.com
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Running Locally

- **Start Backend**:
  ```bash
  cd backend
  npm run start:dev
  ```

- **Start Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```

---

## 🌐 Deployment

The project is optimized for deployment on **Vercel**. Both `frontend` and `backend` include `vercel.json` configurations for seamless deployment.

---

## 🎨 Design Philosophy

Titli's digital home is designed to feel like a theatre performance.
- **Color Palette**: Deep Forest Green (`#0c1410`) paired with the vibrant Titli Yellow/Green (`#E5FC54`).
- **Typography**: A blend of elegant Serif for headlines and clean Sans-Serif for body text.
- **Motion**: Every transition is purposeful, mirroring the movement of a butterfly or the opening of a stage curtain.

---

© 2021 Titli Foundation. *Art for Change.*
