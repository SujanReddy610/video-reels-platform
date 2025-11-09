// // models/PrivacyModel.js
// import mongoose from "mongoose";

// const privacySchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true, // one privacy record per user
//     },
//     videoVisibility: {
//       type: String,
//       enum: ["public", "subscribers", "private"],
//       default: "public",
//     },
//     allowMessages: {
//       type: String,
//       enum: ["everyone", "subscribers", "none"],
//       default: "everyone",
//     },
//     showBadges: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// const PrivacyModel = mongoose.model("Privacy", privacySchema);

// export default PrivacyModel;


// models/privacyModel.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // your Sequelize instance
import User from "./User.js"; // assuming you have a User model

const Privacy = sequelize.define("Privacy", {
  userId: {
    type: DataTypes.INTEGER, // or BIGINT if your user IDs are large
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: "id",
    },
  },
  videoVisibility: {
    type: DataTypes.ENUM("public", "subscribers", "private"),
    defaultValue: "public",
  },
  allowMessages: {
    type: DataTypes.ENUM("everyone", "subscribers", "none"),
    defaultValue: "everyone",
  },
  showBadges: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

export default Privacy;
