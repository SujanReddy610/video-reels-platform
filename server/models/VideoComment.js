import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Video from './Video.js';

const VideoComment = sequelize.define('VideoComment', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  videoId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
}, { timestamps: true });

VideoComment.belongsTo(User, { foreignKey: 'userId' });
VideoComment.belongsTo(Video, { foreignKey: 'videoId' });
export default VideoComment;
