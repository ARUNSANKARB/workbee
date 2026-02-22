# WorkBee Backend

Backend server for WorkBee - A Local Skill Exchange Platform

## Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your MongoDB connection string and other credentials
   ```bash
   cp .env.example .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

4. **Check health**
   Visit `http://localhost:5000/api/health` to verify the server is running

## File Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection
├── controllers/              # Route handlers (will be added)
├── models/                   # Mongoose schemas (will be added)
├── routes/                   # API routes (will be added)
├── middleware/               # Custom middleware (will be added)
├── services/                 # Business logic (will be added)
├── utils/
│   ├── constants.js         # Application constants
│   ├── jwt.js               # JWT utilities
│   └── helpers.js           # Helper functions
├── server.js                # Express app entry point
├── package.json             # Dependencies
├── .env.example             # Environment variables template
└── .gitignore               # Git ignore file
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/workbee |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |
| JWT_SECRET | JWT signing secret | your_secret_key |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | your_cloud_name |
| CLOUDINARY_API_KEY | Cloudinary API key | your_api_key |
| CLOUDINARY_API_SECRET | Cloudinary API secret | your_api_secret |

## API Endpoints Structure

- `/api/auth` - Authentication (login, signup, logout)
- `/api/workers` - Worker profile management
- `/api/bookings` - Booking management
- `/api/reviews` - Review management
- `/api/admin` - Admin operations
- `/api/categories` - Service categories

## Development

### Run tests (when added)
```bash
npm test
```

### Stop server
Press `Ctrl + C` in the terminal

## Next Steps

1. Create MongoDB Atlas cluster and get connection string
2. Configure Cloudinary account
3. Update .env file with your credentials
4. Run `npm install` to install dependencies
5. Run `npm run dev` to start the server
6. Implement Mongoose models (Step 2)
