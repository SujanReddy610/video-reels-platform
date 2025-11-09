import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const VideoReaction = sequelize.define('VideoReaction', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.ENUM('like', 'dislike'), allowNull: false },
}, {
  tableName: 'VideoReactions',
  timestamps: true
});

VideoReaction.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(VideoReaction, { foreignKey: 'userId' });

export default VideoReaction;
