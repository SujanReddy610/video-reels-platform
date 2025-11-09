// // ----------------- models/ChatGroup.js -----------------
// import { DataTypes } from "sequelize";
// import sequelize from "../config/db.js";
// import User from "./User.js"; // assuming User model exists


// const ChatGroup = sequelize.define(
//   "ChatGroup",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       comment: "Name of the chat group or channel",
//     },
//     isDirect: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//       comment: "True if this is a direct (1-on-1) chat",
//     },
//     ownerId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       comment: "If set, this represents the owner of a creator channel",
//       references: {
//         model: User,
//         key: "id",
//       },
//       onDelete: "CASCADE",
//       onUpdate: "CASCADE",
//     },
//   },
//   {
//     tableName: "ChatGroups",
//     timestamps: true,
//   }
// );

// export default ChatGroup;
























































// display chats of user
// ----------------- models/ChatGroup.js -----------------
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js"; // Ensure User model is imported

/**
 * ChatGroup model
 * -----------------
 * Represents either:
 * - A user channel (like "smini") where multiple users can message that user.
 * - Or a direct/private chat if isDirect = true.
 */

const ChatGroup = sequelize.define(
  "ChatGroup",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // The display name of the group or channel
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Name of the chat group or channel (e.g., 'smini')",
    },

    // Whether this is a direct one-to-one chat
    isDirect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "True if this is a direct (1-on-1) chat, false for channels",
    },

    // Owner of the channel (e.g., the uploader)
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      comment: "Owner of the group or channel (e.g., uploader user ID)",
    },
  },
  {
    tableName: "ChatGroups",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name", "ownerId"],
      },
    ],
  }
);

// ----------------- ASSOCIATIONS -----------------
ChatGroup.associate = (models) => {
  ChatGroup.belongsTo(models.User, {
    foreignKey: "ownerId",
    as: "owner",
  });
};

export default ChatGroup;
