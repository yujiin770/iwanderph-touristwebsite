import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/supabase.js';

// Routes
import authRoutes from './routes/auth.js';
import destinationRoutes from './routes/destinations.js';
import galleryRoutes from './routes/gallery.js';
import heroRoutes from './routes/hero.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize database
initializeDatabase().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
