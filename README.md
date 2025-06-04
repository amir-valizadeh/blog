# Blog Dashboard Project

Modern blog management dashboard with Vue.js, TypeScript, and Docker.

[link to demo](https://blog-one-lilac-38.vercel.app/)
## 🎯 Overview

Full-featured blog dashboard for creating, editing, and managing articles. Includes authentication, responsive design, and mobile-first approach.

## 🛠️ Tech Stack

- **Vue.js 3** - Composition API
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first CSS
- **Biome** - Linting and formatting
- **Husky** - Git hooks
- **Docker** - Containerization
- **featslice** - Custom state management package I developed

## 📁 Structure

```
src/
├── app/                     # Application core
├── pages/                   # Page components (auth, article, dashboard, profile)
├── shared/                  # API, layouts, utilities
├── design-system/          # UI components
└── components/             # General components
```

**Key Decisions:**
- Feature-based organization
- Three layouts: Main, Auth, Dashboard
- Centralized API with TanStack Query
- Custom featslice for state management

## 🐳 Docker Setup

Fully containerized with multi-stage builds and Nginx reverse proxy.

**Configurations:**
- `docker-compose.yml` - Development
- `docker-compose.override.yml` - Dev overrides
- `docker-compose.prod.yml` - Production

## 🚀 Features

**✅ Implemented:**
- Authentication (login, signup, JWT, route guards)
- Article CRUD with rich editor and tags
- Responsive dashboard (table/mobile cards)
- User permissions (edit own articles only)
- Loading states, error handling, notifications

**🔄 Ready to Implement:**
- **Profile Management** - Architecture and routing ready, needs form implementation

## 🧪 Future Testing

With extra time, will add:
- **Unit Tests** - Components, API hooks, utilities
- **E2E Tests** - Authentication, CRUD operations, mobile responsive

## 💡 Development Notes

**Vue.js Learning:** I designed the architecture, routing, and tooling setup. Used Claude AI for Vue.js syntax and best practices while maintaining the overall technical vision.

**Code Quality:** Chose Biome over ESLint/Prettier for speed and simplicity. Husky ensures quality through pre-commit hooks.

## 🔧 Quick Start

- **Local:** `npm run dev`
- **Docker:** `docker-compose up`
- **Build:** `npm run build`

## 🎉 Summary

Modern Vue.js blog dashboard with TypeScript, Docker, and quality tooling. Features responsive design, authentication, and article management. Ready for profile implementation and future testing expansion.