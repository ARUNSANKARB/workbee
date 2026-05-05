import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/database.js';
import './config/cloudinary.js';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import skillRoutes from './routes/skills.js';
import bookingRoutes from './routes/booking.js'
import reviewRoutes from './routes/review.js'
import paymentRoutes from './routes/payment.js'

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => {
  res.json({ message: 'WorkBee API is running' })
})

app.use('/auth', authRoutes);
app.use('/skills',skillRoutes);
app.use('/booking',bookingRoutes);
app.use('/review',reviewRoutes);
app.use('/payment',paymentRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
  }
  );
}

startServer();
