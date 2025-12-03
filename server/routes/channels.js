const express = require('express');
const router = express.Router();
const { Channel, User } = require('../models');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const channels = await Channel.findAll();
    // Map id to _id for client compatibility
    const channelsWithId = channels.map(c => ({ ...c.toJSON(), _id: c.id }));
    res.json(channelsWithId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  const { name, description } = req.body;
  try {
    const channel = await Channel.create({
      name,
      description,
    });
    // Add creator as member
    const user = await User.findByPk(req.user.id);
    await channel.addUser(user);
    
    res.status(201).json({ ...channel.toJSON(), _id: channel.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
