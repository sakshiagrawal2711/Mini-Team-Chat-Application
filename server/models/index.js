const { sequelize } = require('../config/db');
const User = require('./User');
const Channel = require('./Channel');
const Message = require('./Message');

// Associations
User.belongsToMany(Channel, { through: 'ChannelMembers' });
Channel.belongsToMany(User, { through: 'ChannelMembers' });

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
User.hasMany(Message, { foreignKey: 'senderId', onDelete: 'CASCADE' });

Message.belongsTo(Channel, { foreignKey: 'channelId' });
Channel.hasMany(Message, { foreignKey: 'channelId', onDelete: 'CASCADE' });

module.exports = { User, Channel, Message, sequelize };
