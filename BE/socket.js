const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { saveMessage } = require("./controllers/messageController");

const initializeSocket = (server) => {
  let userSocketMap = {};

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id;
    userSocketMap[userId] = socket.id;
    console.log(`✅ ${userId} connected with socket ID: ${socket.id}`);

    socket.on("sendMessage", async ({ receiverId, content }) => {
      const senderId = socket.user._id;

      try {
        const savedMessage = await saveMessage({ sender: senderId, receiver: receiverId, content });

        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", savedMessage);
        }

        socket.emit("newMessage", savedMessage);

      } catch (error) {
        console.error("❌ Error saving/sending message:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 ${userId} disconnected`);
      delete userSocketMap[userId];
    });
  });

  return io;
};

module.exports = { initializeSocket };
