import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Badge = sequelize.define("Badge", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  badges: {
    type: DataTypes.JSON, // store as array of strings ["uploader", "popular"]
    defaultValue: [],
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Badge;
