// models/Notification.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Sequelize instance
import User from "./User.js";
import Video from "./Video.js";

/**
 * Notification Model
 * Represents a notification sent to a user when a video is uploaded by a subscribed creator
 * or for any other system event.
 */
const Notification = sequelize.define(
  "Notification",
  {
    /**
     * The subscriber who will receive the notification
     */
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    /**
     * The video that triggered the notification (nullable for generic notifications)
     */
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: true, // allow null if notification is not video-specific
      references: {
        model: Video,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    /**
     * Notification message to display
     */
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /**
     * Read/unread status
     */
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    tableName: "notifications",
  }
);

/**
 * Associations
 * - A notification belongs to a user (the subscriber)
 * - A notification may belong to a video (optional)
 */
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });
Notification.belongsTo(Video, { foreignKey: "videoId", as: "video" });

export default Notification;
