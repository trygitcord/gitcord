<div>
    <img src="./public/logo.svg" alt="Gitcord Logo" width="48" height="48">
  <h1>
    Gitcord
  </h1>
  <p><strong>Track smarter. Code better.</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## About

Gitcord is a comprehensive GitHub analytics platform that makes it effortless to monitor and analyze all your GitHub repositories. We provide deep insights with real-time stats, issue patterns, and contributor activity all from a single, unified dashboard.

## Features

- **GitHub Activity Tracking** - Monitor commits, pull requests, and contributions across all repositories
- **Advanced Analytics** - Get insights into coding patterns, language usage, and productivity trends
- **Team Collaboration** - Track team performance and manage organization-wide GitHub activity
- **Real-time Dashboard** - Unified dashboard with beautiful visualizations and leaderboards
- **User Profiles** - Customizable profiles with GitHub integration and contribution graphs
- **Premium Features** - Enhanced analytics and team collaboration tools
- **Secure Authentication** - NextAuth.js with GitHub OAuth integration

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** NextAuth.js with GitHub OAuth
- **State Management:** TanStack Query
- **UI Components:** Radix UI + Custom Components
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Package Manager:** Bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- MongoDB database
- GitHub OAuth App credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/lumi-work/gitcord.git
   cd gitcord
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   MONGODB_URI="mongodb://localhost:27017/gitcord"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GITHUB_ID="your-github-oauth-app-id"
   GITHUB_SECRET="your-github-oauth-app-secret"
   ```

4. **Set up the database**

   ```bash
   # Make sure MongoDB is running
   # The app will automatically create collections on first run
   ```

5. **Run the development server**

   ```bash
   bun run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── feed/              # Main dashboard pages
│   └── user/              # User profile pages
├── components/            # React components
│   ├── landing/          # Landing page components
│   ├── shared/           # Shared UI components
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── models/               # MongoDB models
└── types/                # TypeScript type definitions
```

## API Endpoints

- **Authentication:** `/api/auth/[...nextauth]`
- **User Management:** `/api/user/*`
- **Messages:** `/api/message/*`
- **GitHub Data:** Integrated via GitHub API
- **Leaderboard:** `/api/leaderboard/*`
- **Premium Codes:** `/api/code/*`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Community

- **Discord:** [Join our server](https://discord.gg/8w4yKtBEy2)
- **Twitter:** [@works_lumi](https://x.com/works_lumi)
- **Email:** works.lumi@gmail.com
- **Status:** [Gitcord Status](https://gitcord.betteruptime.com)

## License

This project is licensed under the MIT License.

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=trygitcord/gitcord&type=Date)](https://www.star-history.com/#trygitcord/gitcord&Date)

<div align="center">
  <p>Made with ❤️ by the Lumi Works team</p>
</div>
