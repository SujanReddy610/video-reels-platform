// import { DataTypes } from "sequelize";
// import sequelize from "../config/db.js";
// import User from "./User.js";
// import Video from "./Video.js";

// const Question = sequelize.define("Question", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   videoId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   userId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   text: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   timestamp: {
//     type: DataTypes.FLOAT,
//     allowNull: true,
//   },
// });

// Question.belongsTo(User, { foreignKey: "userId" });
// Question.belongsTo(Video, { foreignKey: "videoId" });

// export default Question;

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Video from "./Video.js";
import Answer from "./Answer.js"; // Optional – only if you have an Answer model

// -----------------------------
// Question Model
// -----------------------------
const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    videoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Video,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    text: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "Question text asked by user",
    },

    timestamp: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "Video timestamp (in seconds) where question was asked",
    },
  },
  {
    tableName: "questions",
    timestamps: true, // adds createdAt and updatedAt
  }
);

// -----------------------------
// Associations
// -----------------------------

// Each question belongs to a user
Question.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
  onDelete: "CASCADE",
});

// Each question is linked to a specific video
Question.belongsTo(Video, {
  foreignKey: "videoId",
  as: "Video",
  onDelete: "CASCADE",
});

// Optional: Each question can have multiple answers (if applicable)
if (Answer) {
  Question.hasMany(Answer, {
    foreignKey: "questionId",
    as: "Answers",
    onDelete: "CASCADE",
  });
}

export default Question;
