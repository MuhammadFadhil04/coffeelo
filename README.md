# Coffeelo — Modern Coffee Shop Web Application

A production-grade full-stack specialty coffee e-commerce web application featuring a customer-facing storefront and a comprehensive admin management dashboard.

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router DOM, Zustand, Axios
- **Animation & UX:** GSAP, ScrollTrigger, Lenis Smooth Scroll, Lucide Icons
- **Backend:** Node.js, Express.js, TypeScript
- **Database & ORM:** MySQL, Prisma ORM
- **Authentication & Validation:** JWT, bcryptjs, Zod, Role-Based Access Control (RBAC)
- **Payment & Storage:** Midtrans Payment Gateway, Cloudinary

## Project Structure

```
coffeelo/
├── frontend/          # React + Vite + TypeScript client application
├── backend/           # Express + TypeScript REST API server
├── docs/              # Architecture, database ERD, & API documentation
├── README.md          # Project documentation
└── .gitignore         # Root git ignore
```

## Quick Start (Phase 1)

### Frontend
```powershell
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`

### Backend
```powershell
cd backend
npm install
npm run dev
```
Runs at `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)
