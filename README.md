# WorkBee - Full Stack MERN Project

A production-ready **Local Skill Exchange Platform** connecting customers with skilled workers (electricians, plumbers, maids, cooks, etc.)

## 🚀 Project Overview

WorkBee is a **desktop-first responsive web platform** (NOT a mobile app) built with:

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **State**: Zustand
- **Animations**: Framer Motion
- **Auth**: JWT + bcryptjs
- **Storage**: Cloudinary
- **Deployment**: Vercel (frontend) + Render (backend)

## 📋 Features Implemented

### Core Features
- ✅ User authentication (register, login, logout)
- ✅ Three user roles (customer, worker, admin)
- ✅ Worker profile creation with skills, rates, documents
- ✅ Service categories management
- ✅ Booking system with complete lifecycle
- ✅ Review and rating system
- ✅ Notification system
- ✅ Admin dashboard for approvals and analytics

### UI/UX
- ✅ Yellow + white theme
- ✅ Rounded cards with shadows
- ✅ Responsive layout (desktop-first)
- ✅ Skeleton loaders
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

### Technical
- ✅ JWT authentication
- ✅ Password hashing (bcryptjs)
- ✅ Geo-spatial queries (MongoDB 2dsphere)
- ✅ Proper error handling
- ✅ CORS enabled
- ✅ Environment-based configs
- ✅ Validation middleware

## 📁 Project Structure

```
WORK-BEE/
├── backend/
│   ├── config/              # Database connection
│   ├── controllers/         # Auth, Workers, Bookings, Reviews, Admin
│   ├── models/              # User, WorkerProfile, Booking, Review, etc.
│   ├── routes/              # API routes
│   ├── middleware/          # Auth, Validation
│   ├── services/            # Business logic
│   ├── utils/               # Helpers, JWT, Constants
│   ├── server.js            # Express app
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Buttons, Cards, Navbar, Footer
│   │   ├── pages/           # Home, Auth, Services, Dashboards
│   │   ├── store/           # Zustand stores
│   │   ├── services/        # API calls
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── .github/
│   └── workflows/           # CI/CD pipelines
│
└── README.md
```

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
- **File Upload**: Multer + Cloudinary
- **Validation**: express-validator
- **CORS**: cors middleware

### Frontend
- **Library**: React 18
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Animation**: Framer Motion
- **Routing**: React Router v6
- **HTTP**: Axios
- **Icons**: React Icons

### DevOps
- **Backend Deploy**: Render
- **Frontend Deploy**: Vercel
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure MongoDB Atlas connection
# Update MONGODB_URI and other env variables

# Start development server
npm run dev
```

Server runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env.local

# Start development server
npm run dev
```

App runs on: `http://localhost:5173`

## 📚 API Documentation

All API endpoints are documented with request/response examples.

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Workers
- `GET /api/workers/category/:categoryId` - Get workers by category
- `GET /api/workers/search` - Search workers by location/skill
- `POST /api/workers/profile` - Create/update worker profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id/accept` - Accept booking
- `PUT /api/bookings/:id/complete` - Complete booking

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/worker/:workerId` - Get worker reviews

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/workers/pending` - Pending worker approvals
- `PUT /api/admin/workers/:id/approve` - Approve worker

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)

## 🗄 Database Models

1. **User** - Customers, Workers, Admins
2. **WorkerProfile** - Detailed worker info, skills, documents
3. **ServiceCategory** - Service types
4. **Booking** - Booking records with status flow
5. **Review** - Worker ratings and feedback
6. **Notification** - System notifications

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected routes with middleware
- Input validation on both frontend and backend
- CORS protection
- SQL injection prevention (via Mongoose)

## 📈 Booking Status Flow

```
pending → accepted → in_progress → completed → reviewed
                  ↓
              rejected
                  ↓
              cancelled
```

## 🎨 UI Features

- Yellow (#FFCF00) + white theme
- Rounded cards (0.75rem - 1rem)
- Responsive grid layouts
- Smooth animations with Framer Motion
- Toast notifications
- Skeleton loaders
- Protected routes

## 📦 Deployment

### Backend (Render)
1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Set environment variables
5. Deploy

### Frontend (Vercel)
1. Create account on [Vercel](https://vercel.com)
2. Import GitHub repo
3. Set `VITE_API_URL` environment variable
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Get connection string
4. Add to backend `.env`

## 🚀 Next Steps

1. **Implement remaining dashboard pages** (Customer, Worker, Admin)
2. **Add payment gateway** (Razorpay/Stripe)
3. **Real-time notifications** (Socket.io)
4. **Location-based filtering** with maps
5. **Messaging system** between users
6. **Admin moderation** features
7. **Analytics** dashboard
8. **Mobile app** (React Native)

## 📝 License

MIT License - feel free to use for portfolio projects

## 👨‍💻 Author

Built by [Your Name] as a resume-level MERN project

---

**Happy Coding! 🚀** 🐝
