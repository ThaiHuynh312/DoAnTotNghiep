const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/upload");
const postRoutes = require("./routes/post");
const notificationRoutes = require("./routes/notification");
const calendarRoutes = require("./routes/calendar");
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/admin');

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', uploadRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes); 
app.use('/api/calendar', calendarRoutes); 
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;