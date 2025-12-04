const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db');
const { Message, User } = require('./models');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect and Sync DB
connectDB().then(() => {
    sequelize.sync({ alter: true }).then(() => console.log('DB Synced'));
});

// Socket.io Logic
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_channel', (channelId) => {
    socket.join(channelId); // channelId is string (or int converted to string by socket.io room)
    console.log(`User ${socket.id} joined channel ${channelId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const newMessage = await Message.create({
        senderId: data.sender,
        channelId: data.channel,
        content: data.content,
      });
      
      const msgWithSender = await Message.findByPk(newMessage.id, {
          include: [{ model: User, as: 'sender', attributes: ['username', 'avatar', 'id'] }]
      });
      
      const formattedMsg = {
          ...msgWithSender.toJSON(),
          _id: msgWithSender.id,
          sender: { ...msgWithSender.sender, _id: msgWithSender.sender.id }
      };
      
      io.to(data.channel).emit('receive_message', formattedMsg);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
  
  socket.on('login', (userData) => {
      onlineUsers.set(userData._id, { socketId: socket.id, username: userData.username });
      const usersList = Array.from(onlineUsers.entries()).map(([id, data]) => ({ _id: id, username: data.username }));
      io.emit('online_users', usersList);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
    for (let [userId, data] of onlineUsers.entries()) {
        if (data.socketId === socket.id) {
            onlineUsers.delete(userId);
            const usersList = Array.from(onlineUsers.entries()).map(([id, data]) => ({ _id: id, username: data.username }));
            io.emit('online_users', usersList);
            break;
        }
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/channels', require('./routes/channels'));
app.use('/api/messages', require('./routes/messages'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
