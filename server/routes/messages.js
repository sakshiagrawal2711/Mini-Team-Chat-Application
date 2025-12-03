const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');
const { protect } = require('../middleware/authMiddleware');

router.get('/:channelId', protect, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    const messages = await Message.findAll({
      where: { channelId: req.params.channelId },
      include: [{ model: User, as: 'sender', attributes: ['username', 'avatar', 'id'] }],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: Number(offset)
    });
    
    // Map id to _id and sender.id to sender._id
    const formattedMessages = messages.map(m => {
        const msg = m.toJSON();
        return {
            ...msg,
            _id: msg.id,
            sender: { ...msg.sender, _id: msg.sender.id }
        };
    });

    res.json(formattedMessages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
