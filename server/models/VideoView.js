// models/VideoView.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Video from './Video.js';
import User from './User.js';

const VideoView = sequelize.define(
  'VideoView',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Video,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'video_views',
    indexes: [
      {
        unique: true,
        fields: ['videoId', 'userId'], // ensures one view per user per video
      },
    ],
    updatedAt: false, // optional, since views don't need updates
  }
);

// ---------------- Associations ----------------
Video.hasMany(VideoView, { foreignKey: 'videoId', onDelete: 'CASCADE' });
User.hasMany(VideoView, { foreignKey: 'userId', onDelete: 'CASCADE' });
VideoView.belongsTo(Video, { foreignKey: 'videoId' });
VideoView.belongsTo(User, { foreignKey: 'userId' });

export default VideoView;
