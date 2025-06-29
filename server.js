const express = require('express');
const http = require('http'); // 🔥 For socket server
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
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

dotenv.config();

// Validate environment variables
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

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json()); // Body parser

// Socket Server Setup
const io = new Server(server, {
  cors: {
    origin: '*', // For development. Use specific URL in production.
    methods: ['GET', 'POST'],
  },
});
//  Socket.IO Events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });
  socket.on('sendMessage', (message) => {
    const { sender, receiver, content } = message;
    io.to(receiver).emit('message', {
      sender,
      receiver,
      content,
      createdAt: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const socketConnection = require('./socket/socket');
socketConnection(server);
