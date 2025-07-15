const express = require('express');
const http = require('http'); // 🔥 For socket server
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const listEndpoints = require('express-list-endpoints'); // 📌 New addition

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const reelRoutes = require('./routes/reelRoutes');
const messageRoutes = require('./routes/messageRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const testRoutes = require('./routes/testRoutes');

dotenv.config();

// 🔒 Validate environment variables
const requiredEnv = [
  'MONGO_USER',
  'MONGO_PASSWORD',
  'MONGO_CLUSTER',
  'MONGO_DB_NAME',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`Fatal Error: Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser

// 🔹 Root API test
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 🔹 GET All Registered GET Routes
app.get('/api/debug/routes', (req, res) => {
  const getRoutes = listEndpoints(app).filter((r) => r.methods.includes('GET'));
  res.json({
    total: getRoutes.length,
    routes: getRoutes.map((r) => ({ path: r.path, methods: r.methods })),
  });
});

// 🔹 API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/test', testRoutes); // includes /cloudinary-test

// 🔹 Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Server Start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // 🧠 Init Socket.IO
    const socketConnection = require('./socket/socket');
    socketConnection(server);

    // 🟢 Start HTTP Server
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);

      // 📋 Log all GET routes
      const endpoints = listEndpoints(app).filter((e) => e.methods.includes('GET'));
      console.log('\n📍 GET Routes:');
      endpoints.forEach((route) => {
        console.log(`${route.methods.join(', ')} → ${route.path}`);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
