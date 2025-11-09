







// // code for youtube
// // import { DataTypes } from 'sequelize';
// // import sequelize from '../config/db.js';
// // import User from './User.js';

// // const Video = sequelize.define(
// //   'Video',
// //   {
// //     id: { 
// //       type: DataTypes.INTEGER, 
// //       autoIncrement: true, 
// //       primaryKey: true 
// //     },
// //     title: { 
// //       type: DataTypes.STRING, 
// //       allowNull: false 
// //     },
// //     description: { 
// //       type: DataTypes.TEXT, 
// //       allowNull: true 
// //     },
// //     filename: { 
// //       type: DataTypes.STRING, 
// //       allowNull: false 
// //     },
// //     videoUrl: {  // ✅ New field
// //       type: DataTypes.STRING,
// //       allowNull: true, // will store /uploads/filename.mp4
// //     },
// //     views: { 
// //       type: DataTypes.INTEGER, 
// //       defaultValue: 0 
// //     },
// //     duration: {        
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       defaultValue: 0
// //     },
// //     userId: {          
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: User,
// //         key: 'id'
// //       },
// //       onDelete: 'CASCADE'
// //     }
// //   },
// //   {
// //     tableName: 'Videos',
// //     timestamps: true,
// //   }
// // );

// // Video.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// // User.hasMany(Video, { foreignKey: 'userId', as: 'videos' });

// // export default Video;




// // video privacy setting
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Video = sequelize.define(
  "Video",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true, // will store path like /uploads/filename.mp4
    },

    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    // 🆕 Privacy setting for the video
    privacy: {
      type: DataTypes.ENUM("public", "network", "private", 'subscribers', 'onlyme'),
      defaultValue: "public",
      allowNull: false,
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
  },
  {
    tableName: "Videos",
    timestamps: true,
  }
);

// Associations
Video.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Video, { foreignKey: "userId", as: "videos" });

export default Video;



