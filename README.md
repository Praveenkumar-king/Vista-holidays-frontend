# Travel Application — Intelligent Travel Discovery & Itinerary Platform

A modern, design-led full-stack travel web application built with **React 18**, **Vite**, **Tailwind CSS**, and **Node.js/Express**, featuring real-time meteorological forecasts, external destination imagery, and **Google Gemini AI** travel assistance and structured itinerary planning.

---

## 🌟 Overview

**Travel Application** provides an intuitive, editorial-grade interface for discovering worldwide travel destinations, exploring verified landmarks, detecting real-time device or destination weather forecasts, consulting a contextual AI Travel Assistant, and generating tailored day-by-day travel itineraries.

> **Architecture Notice:** This application does not require a database. Destination and famous-place reference records are maintained in structured application data, while live weather, image, and AI functionality are provided through backend-integrated external services with complete server-side API key protection.

---

## ✨ Key Features

- **Cinematic Looping Video Hero:** Accessible HTML5 looping background video with dark vignette overlays, accessible text hierarchy, and graceful CSS gradient fallbacks.
- **Destination Explorer:** Interactive multi-parameter search and category/region filtering across 20 curated global destinations with zero layout shifts and instant filter clearing.
- **Destination Details & Famous Places:** Dedicated deep-dive destination views (`/destinations/:id`) presenting 57 verified landmarks, visiting hours, and detailed modal overviews.
- **Geographic Location Awareness:** Browser Geolocation API integration with permission-denied handling, coordinate accuracy indicators, manual search fallback, and localStorage persistence.
- **Real-Time Weather Telemetry:** Server-proxied OpenWeather integration delivering temperature, feels-like, wind speed, humidity, atmospheric pressure, and weather conditions.
- **Dynamic External Imagery:** Server-proxied Pexels image search delivering landscape photography, photographer attributions, and smooth skeleton crossover with fallback branding.
- **Gemini AI Travel Assistant:** Interactive floating travel assistant powered by Google Gemini 1.5 Flash with starter prompts, message history, safe Markdown parsing, and retry handling.
- **Structured Multi-Day AI Itinerary Planner:** Custom AI itinerary generator producing structured day-by-day schedules (morning, afternoon, evening activities) with activity categories and preference customization (budget, travelers, pace, interests).
- **Production UX & Error System:** Comprehensive state management handling loading skeletons, network disconnection, API timeouts, geolocation denials, empty search queries, and route 404s.
- **WCAG Accessibility & Keyboard Navigation:** Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`), `"Skip to main content"` keyboard link, high-contrast `:focus-visible` rings, screen-reader live regions, and full `@media (prefers-reduced-motion: reduce)` support.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** [React 18](https://react.dev/) (Functional Components, Custom Hooks, Context API)
- **Build Tool:** [Vite](https://vitejs.dev/) (Fast HMR, optimized tree-shaken bundling)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom typography, motion tokens, responsive grids)
- **Routing:** [React Router v6](https://reactrouter.com/) (Client-side routing with deep link fallback)
- **Icons:** [Lucide React](https://lucide.dev/) (Accessible vector iconography)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) (ES Modules)
- **Server Framework:** [Express](https://expressjs.com/) (RESTful API architecture)
- **Middleware:** [CORS](https://github.com/expressjs/cors), [Morgan](https://github.com/expressjs/morgan), Centralized Error Handler, 404 Route Catcher
- **AI SDK:** [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini 1.5 Flash SDK)
- **Configuration:** [dotenv](https://github.com/motdotla/dotenv)

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (SPA)                     │
│           (React 18 + Vite + Tailwind CSS + Router)          │
└──────────────────────────────┬──────────────────────────────┘
                               │
               JSON REST API   │ (VITE_API_BASE_URL)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express Backend Proxy Server                │
│    (Node.js + Express Middleware + In-Memory Cache + CORS)   │
└──────────────┬───────────────┬───────────────┬──────────────┘
               │               │               │
  HTTPS API    │  HTTPS API    │  HTTPS API    │
  (Secret Key) │  (Secret Key) │  (Secret Key) │
               ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   OpenWeather    │ │    Pexels API    │ │  Google Gemini   │
│  Weather Current │ │  Landscape Media │ │ 1.5 Flash AI API │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

> **Security Guarantee:** Secret API keys (`OPENWEATHER_API_KEY`, `PEXELS_API_KEY`, `GEMINI_API_KEY`) remain strictly on the Express backend and are never bundled into client assets.

---

## 📁 Project Directory Structure

```
travel-application/
├── client/
│   ├── public/
│   │   ├── favicon.svg               # Branded compass favicon
│   │   ├── _redirects                # SPA routing redirects for static hosting
│   │   └── videos/
│   │       └── hero-travel.mp4       # Local looping hero background video
│   ├── src/
│   │   ├── assets/                   # Static visual assets
│   │   ├── components/
│   │   │   ├── ai/                   # AI Travel Assistant & Chat UI
│   │   │   ├── common/               # AppErrorBoundary, NetworkStatus, Skeletons
│   │   │   ├── destinations/         # Destination cards, search, filters, modals
│   │   │   ├── images/               # RemoteImage with cross-fade & fallback
│   │   │   ├── itinerary/            # AI Itinerary form, timeline & day cards
│   │   │   ├── layout/               # Navbar, Footer, Container, SkipLink
│   │   │   ├── location/             # Location selector, search & indicators
│   │   │   ├── sections/             # Hero, Explorer, Weather sections
│   │   │   ├── ui/                   # Button, Card, Badge, Input, Select, Spinner
│   │   │   └── weather/              # WeatherCard, WeatherSkeleton, WeatherError
│   │   ├── context/                  # AppContext, LocationContext, AssistantContext
│   │   ├── data/                     # 20 Curated Destinations & 57 Famous Places
│   │   ├── hooks/                    # useLocation, useTravelAssistant, useRemoteImage
│   │   ├── layouts/                  # MainLayout with SkipLink and landmarks
│   │   ├── pages/                    # HomePage, DestinationsPage, DestinationDetailPage, NotFoundPage
│   │   ├── services/                 # apiClient, weatherService, imageService, aiService
│   │   ├── utils/                    # errorMessages, imageQueries, formatting
│   │   ├── App.jsx                   # Top-level application with routing & providers
│   │   ├── index.css                 # Focus styles, animations, reduced motion
│   │   └── main.jsx                  # React DOM entry point
│   ├── index.html                    # HTML5 shell with semantic meta & Google Fonts
│   ├── package.json                  # Frontend dependencies
│   ├── tailwind.config.js            # Design tokens, motion easings & colors
│   └── vite.config.js                # Vite build and server config
│
├── server/
│   ├── src/
│   │   ├── config/                   # Environment config (CORS, keys, ports)
│   │   ├── controllers/              # health, weather, image, and AI controllers
│   │   ├── middleware/               # errorHandler, notFoundHandler
│   │   ├── routes/                   # Express routes (/health, /weather, /images, /ai)
│   │   ├── services/                 # weatherService, imageService, geminiService
│   │   ├── utils/                    # itineraryValidation, apiResponse
│   │   ├── app.js                    # Express application instance
│   │   └── server.js                 # Server listener entry point
│   ├── .env.example                  # Template of backend environment variables
│   ├── .gitignore                    # Server ignore rules
│   └── package.json                  # Backend dependencies
│
├── docs/
│   └── screenshots/                  # Documentation screenshots
├── .gitignore                        # Root repository git ignore
├── DEPLOYMENT_CHECKLIST.md           # Step-by-step production deployment checklist
├── VIDEO_SCRIPT.md                   # 2-minute video presentation script
├── VIDEO_CHECKLIST.md                # Video recording and Drive sharing checklist
├── SUBMISSION_CHECKLIST.md           # Final assessment submission verification checklist
├── package.json                      # Root script runner for concurrent development
└── README.md                         # Main project documentation
```

---

## 📋 Assessment Requirements Mapping

| Evaluation Requirement | Implementation Details |
| :--- | :--- |
| **Landing Hero Experience** | High-impact looping background video with ambient light accents, headline typography, and action CTAs (`Hero.jsx`). |
| **Destination Explorer** | Interactive search, region and category filter pills, sort controls, and responsive grid (`DestinationExplorer.jsx`). |
| **Famous Places Discovery** | 57 real landmark entries with category tags, visit durations, highlights, and modal overview (`FamousPlaceCard.jsx`, `PlaceDetailModal.jsx`). |
| **Location Awareness** | HTML5 Geolocation API detection, latitude/longitude coordinates, manual search dropdown, and state caching (`LocationContext.jsx`, `LocationSelector.jsx`). |
| **Real-Time Weather** | Server-proxied OpenWeather integration displaying temperature, feels-like, wind, humidity, and condition icon (`weatherService.js`, `WeatherCard.jsx`). |
| **External Image API** | Server-proxied Pexels integration with responsive image caching, skeleton placeholders, and gradient fallback (`imageService.js`, `RemoteImage.jsx`). |
| **AI Travel Assistant** | Gemini 1.5 Flash conversational assistant with context injection (current location & weather) and Markdown rendering (`geminiService.js`, `ChatWindow.jsx`). |
| **AI Itinerary Planner** | Structured multi-day JSON itinerary generator with preferences for budget, pace, travelers, and interests (`itineraryValidation.js`, `ItineraryPlanner.jsx`). |
| **State & Failure UX** | Dedicated loading skeletons, error states with retry actions, empty search states, offline banner, and error boundary (`AppErrorBoundary.jsx`, `NetworkStatus.jsx`). |
| **Accessibility (WCAG)** | Skip link, semantic HTML landmarks, visible focus rings, label associations, screen-reader live regions, and reduced motion (`usePageMetadata.js`, `index.css`). |
| **Responsive Foundation** | Fluid mobile-first layout tested across 320px, 375px, 390px, 430px, 768px, 1024px, 1440px, and 1920px. |

---

## 📸 Screenshots

| View | Screenshot Reference |
| :--- | :--- |
| **Hero Landing Section** | ![Hero](docs/screenshots/home.png) |
| **Destination Explorer** | ![Explorer](docs/screenshots/destinations.png) |
| **Destination Details & Famous Places** | ![Details](docs/screenshots/destination-details.png) |
| **Live Weather Telemetry** | ![Weather](docs/screenshots/weather.png) |
| **AI Travel Assistant** | ![AI Assistant](docs/screenshots/ai-assistant.png) |
| **AI Itinerary Planner** | ![AI Itinerary](docs/screenshots/itinerary.png) |
| **Mobile Responsive Layout** | ![Mobile View](docs/screenshots/mobile.png) |

---

## ⚙️ Environment Variables

### Backend (`server/.env`):
```ini
PORT=5000
CLIENT_URL=http://localhost:5173
OPENWEATHER_API_KEY=your_openweather_api_key_here
PEXELS_API_KEY=your_pexels_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### Frontend (`client/.env`):
```ini
# Base API endpoint pointing to Express backend
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Local Setup & Installation

### Option 1: Concurrent Quick Start (Root-Level)

```bash
# Clone the repository
git clone <repository-url>
cd travel-application

# Install all dependencies (root, client, and server)
npm run install:all

# Start both frontend and backend concurrently
npm run dev
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)

---

### Option 2: Running Client and Server Separately

#### 1. Backend Server Setup
```bash
cd server
copy .env.example .env    # Windows Command Prompt
# or: cp .env.example .env (macOS/Linux)
npm install
npm run dev
```

#### 2. Frontend Client Setup
```bash
cd client
copy .env.example .env    # Windows Command Prompt
# or: cp .env.example .env (macOS/Linux)
npm install
npm run dev
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Sample Query / Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status | None |
| `GET` | `/api/weather/current` | Real-time weather telemetry | `?lat=48.8566&lon=2.3522` |
| `GET` | `/api/images/search` | External landscape photography | `?query=Paris&perPage=1` |
| `POST` | `/api/ai/chat` | Gemini Travel Assistant chat | `{ "message": "What to do in Paris?", "context": {} }` |
| `POST` | `/api/ai/itinerary` | Structured AI itinerary planner | `{ "destination": { "name": "Paris" }, "days": 3 }` |

---

## ♿ Accessibility & Motion System

- **Accessible Focus States:** Two-tone high-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2`).
- **Keyboard Usability:** Full tab-order coverage across navigation links, search inputs, modal triggers, and AI chat input with `Escape` dismiss listeners.
- **Skip Link:** Direct skip-to-content mechanism (`.skip-link`) bypassing header navigation to focus on `#main-content`.
- **Form Controls:** 100% paired `<label htmlFor="...">` and `<input id="...">` associations with `role="alert"` for inline validation messages.
- **Reduced Motion:** Automatic disabling of background video playback and CSS animations for users with `prefers-reduced-motion: reduce`.

---

## 🔒 Security & Data Hygiene

- **Secret Isolation:** 0 client-side API keys; all third-party credentials reside in `server/.env`.
- **Git Protection:** Comprehensive `.gitignore` preventing `.env`, `.env.*`, and `node_modules` from entering source control.
- **Request Validation:** Strict boundary checks for coordinates (lat -90..90, lon -180..180), string lengths, and numeric parameters.
- **Error Normalization:** Zero stack traces or internal filesystem paths returned in API response bodies.

---

## 🚢 Production Deployment Guide

1. **Frontend Hosting (Vercel / Netlify / Cloudflare Pages):**
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
   - Environment Variable: `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`
   - Static Routing: Provided by `client/public/_redirects`

2. **Backend Hosting (Render / Railway / Fly.io):**
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
   - Environment Variables: `PORT`, `CLIENT_URL=https://your-frontend.vercel.app`, `GEMINI_API_KEY`, `OPENWEATHER_API_KEY`, `PEXELS_API_KEY`

---

## 📄 License

This project was developed for the **Design Esthetics Front-End Developer Technical Assessment**.
