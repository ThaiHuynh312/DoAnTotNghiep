const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const { saveMessage } = require('./controllers/messageController');
const { initializeSocket } = require("./socket.js");
const cors = require('cors');
require('dotenv').config();

const server = http.createServer(app);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,             
}));

initializeSocket(server);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log('Server running...');
    });
  })
  .catch(err => console.log(err));

