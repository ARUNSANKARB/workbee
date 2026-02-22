# WorkBee Frontend

Frontend for WorkBee - A Local Skill Exchange Platform

## Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   - Update `VITE_API_URL` to your backend URL

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## Deployment to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Set environment variables:
   - `VITE_API_URL`: Your backend Render URL
6. Click Deploy

## File Structure

```
frontend/src/
├── components/
│   ├── common/          # Button, Card, Toast, Skeleton
│   ├── layout/          # Navbar, Footer
│   └── cards/           # WorkerCard, BookingCard, ReviewCard
├── pages/               # Home, Auth, Services, Dashboards
├── store/               # Zustand stores (auth, booking, worker)
├── services/            # API calls
├── hooks/               # Custom hooks (useNotification)
├── utils/               # Helpers and constants
├── App.jsx              # Main app with routing
└── main.jsx             # Entry point
```

## Features

- ✅ Yellow + white theme with Tailwind CSS
- ✅ Rounded cards with shadow effects
- ✅ Responsive layout (desktop-first)
- ✅ Framer Motion animations
- ✅ Zustand state management
- ✅ Protected routes
- ✅ Toast notifications
- ✅ Loading skeletons

## Technologies

- React 18
- Vite
- Tailwind CSS
- Zustand
- Framer Motion
- React Router
- Axios

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
