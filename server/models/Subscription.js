

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Subscription = sequelize.define("Subscription", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subscriberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subscribedToId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: false,
});

// Relations
User.hasMany(Subscription, { foreignKey: "subscriberId", as: "subscriptions" });
User.hasMany(Subscription, { foreignKey: "subscribedToId", as: "subscribers" });

Subscription.belongsTo(User, { foreignKey: "subscriberId", as: "subscriber" });
Subscription.belongsTo(User, { foreignKey: "subscribedToId", as: "subscribedTo" });

export default Subscription;


































































// // render backend hosting
// import { DataTypes } from "sequelize";
// import sequelize from "../config/db.js";
// import User from "./User.js";

// // Define Subscription model
// const Subscription = sequelize.define(
//   "Subscription",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     subscriberId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     subscribedToId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   },
//   {
//     timestamps: true,
//     createdAt: "createdAt", // keep createdAt column
//     updatedAt: false,       // disable updatedAt column
//   }
// );

// // ------------------
// // Associations
// // ------------------

// // A user can have many subscriptions (who they are following)
// User.hasMany(Subscription, { foreignKey: "subscriberId", as: "subscriptions" });

// // A user can have many subscribers (people following them)
// User.hasMany(Subscription, { foreignKey: "subscribedToId", as: "subscribers" });

// // Each subscription belongs to the subscriber
// Subscription.belongsTo(User, { foreignKey: "subscriberId", as: "subscriber" });

// // Each subscription belongs to the user being followed
// Subscription.belongsTo(User, { foreignKey: "subscribedToId", as: "subscribedTo" });

// export default Subscription;
