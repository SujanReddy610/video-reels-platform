import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Answer = sequelize.define(
  "Answer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "answers",
    timestamps: true,
  }
);

// Only associate after importing Question in a central file

Answer.belongsTo(User, { foreignKey: "userId", as: "User" });

export default Answer;
