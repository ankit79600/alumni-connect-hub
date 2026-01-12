A centralized alumni–student networking platform where undergraduate students can connect with their pass-out seniors for mentorship, jobs, events, and guidance.

This project aims to bridge the gap between colleges and their alumni community through a modern, scalable web platform.

🚀 Features

🔐 Authentication using Supabase (Email / Google OAuth ready)

👨‍🎓 Student & Alumni profiles

📰 Alumni can post:

Jobs

Internships

Events

Stories & achievements

📢 News and announcements for students

🌍 Global alumni reach section (Google Maps integration ready)

📱 Fully responsive UI

🎨 Clean UI using shadcn/ui + Tailwind CSS

🔧 Admin approval system and advanced role-based access are planned in upcoming versions.

🛠 Tech Stack
Frontend

⚛️ React (with TypeScript)

⚡ Vite

🎨 Tailwind CSS

🧩 shadcn/ui components

Backend / Services

🟢 Supabase (Auth + Database)

🔐 Google OAuth (Google Identity Services)

📍 Google Maps SDK (for alumni location & reach)

Dev Tools

ESLint

PostCSS

Bun / npm

📂 Project Structure
alumni-connect-hub/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── lib/               # Supabase & auth utilities
│   ├── hooks/             # Custom React hooks
│   └── main.tsx           # App entry point
├── supabase/              # Supabase configs & migrations
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json

⚙️ Environment Setup

Create a .env file in the root directory and add:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key


⚠️ Never push your real API keys to GitHub.

▶️ How to Run Locally
1. Clone the repo
git clone https://github.com/ankit79600/alumni-connect-hub.git
cd alumni-connect-hub

2. Install dependencies
npm install
# or
bun install

3. Start development server
npm run dev
# or
bun dev


Open in browser:
👉 http://localhost:8080
 (or the port shown in terminal)

📌 Current Status

✅ UI and main structure implemented

✅ Supabase authentication connected

✅ Google technologies integrated

🚧 Role-based access control (Admin / Alumni / Student) — in progress

🚧 Post moderation system — planned

🚧 Chat & mentorship system — planned

🎯 Future Improvements

💬 Real-time chat between students and alumni

🧠 AI-based mentor recommendation

📊 Admin analytics dashboard

🏫 Multi-college onboarding system

📄 Resume upload & verification

🤝 Contributions

Contributions, ideas, and feedback are welcome!

Steps:

Fork the repo

Create a new branch

Make changes

Submit a Pull Request

👨‍💻 Author

Ankit Patel
B.Tech CSE Student | Tech & Web Enthusiast 🚀
Building projects to solve real-world problems and preparing for hackathons.

GitHub: https://github.com/ankit79600

⭐ Support

If you like this project, please give it a ⭐ on GitHub — it really motivates me to build more!
