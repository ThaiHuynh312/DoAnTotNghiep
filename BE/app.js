const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/upload");
const postRoutes = require("./routes/post");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use("/api", uploadRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;