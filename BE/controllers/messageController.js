const Message = require('../models/Message');

exports.saveMessage = async ({ sender, receiver, content }) => {
  const message = await Message.create({ sender, receiver, content });
  return message;
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const sender = req.user._id;

    const message = await Message.create({ sender, receiver, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUser, receiver: userId },
        { sender: userId, receiver: currentUser },
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

