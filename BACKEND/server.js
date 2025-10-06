import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from './models/orderModel.js';
import { errorHandler, notFound } from './utils/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static uploads directory so images are accessible via absolute URLs
// e.g., http://localhost:5000/uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/image-proxy', imageRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('E-Commerce API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    try {
      // Ensure a partial unique index on orderNumber
      const coll = mongoose.connection.db.collection('orders');
      const indexes = await coll.indexes();
      // Drop default-named index if present to avoid name conflicts
      const defaultNamed = indexes.find((i) => Array.isArray(i.key) ? false : i.key.orderNumber === 1 && i.name === 'orderNumber_1');
      if (defaultNamed) {
        await coll.dropIndex('orderNumber_1');
      }
      const existing = indexes.find((i) => Array.isArray(i.key) ? false : i.key.orderNumber === 1 && i.name === 'orderNumber_unique');
      if (!existing) {
        await coll.createIndex(
          { orderNumber: 1 },
          { name: 'orderNumber_unique', unique: true, partialFilterExpression: { orderNumber: { $type: 'string' } } }
        );
      }
    } catch (e) {
      console.log('Index ensure error (non-fatal):', e.message);
    }
  })
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Start server with automatic port retry if in use
const BASE_PORT = Number(process.env.PORT) || 5000;

function startServer(port, attempts = 0) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attempts < 5) {
      const nextPort = port + 1;
      console.log(`Port ${port} in use. Retrying on ${nextPort}...`);
      setTimeout(() => startServer(nextPort, attempts + 1), 200);
    } else {
      console.error('Server failed to start:', err.message || err);
      process.exit(1);
    }
  });
}

startServer(BASE_PORT);