import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import ChatGroup from "./ChatGroup.js";

const ChatMessage = sequelize.define(
  "ChatMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Text content of the message",
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "True if the message has been read",
    },
    // Foreign key: sender of the message
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    // Foreign key: chat group to which the message belongs
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChatGroup,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "ChatMessages",
    timestamps: true,
  }
);

// ------------------ ASSOCIATIONS ------------------
// Associations are defined in associations.js to avoid circular imports

export default ChatMessage;














































// // models/ChatMessage.js
// import { DataTypes } from "sequelize";
// import sequelize from "../config/db.js";
// import User from "./User.js";
// import ChatGroup from "./ChatGroup.js";

// const ChatMessage = sequelize.define(
//   "ChatMessage",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     message: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//       comment: "Text content of the message",
//     },
//     read: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//       comment: "True if the message has been read",
//     },
//     senderId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: User,
//         key: "id",
//       },
//       onDelete: "CASCADE",
//       comment: "ID of the user who sent the message",
//     },
//     groupId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: ChatGroup,
//         key: "id",
//       },
//       onDelete: "CASCADE",
//       comment: "ID of the chat group this message belongs to",
//     },
//   },
//   {
//     tableName: "ChatMessages",
//     timestamps: true,
//   }
// );

// // ------------------ ASSOCIATIONS ------------------
// // Note: Import associations in models/index.js to avoid circular imports
// // ChatMessage.belongsTo(User, { foreignKey: "senderId", as: "sender" });
// // ChatMessage.belongsTo(ChatGroup, { foreignKey: "groupId", as: "group" });

// export default ChatMessage;
// ChatMessage.js