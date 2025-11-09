



// // // models/User.js
// // // models/User.js
// import { DataTypes } from 'sequelize';
// import sequelize from '../config/db.js';


// // ---------------------
// // Define User model
// // ---------------------
// const User = sequelize.define(
//   'User',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: { msg: 'Name cannot be empty' },
//       },
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: { msg: 'Email must be unique' },
//       validate: {
//         isEmail: { msg: 'Must be a valid email address' },
//       },
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: { msg: 'Password cannot be empty' },
//         len: {
//           args: [6, 100],
//           msg: 'Password must be at least 6 characters long',
//         },
//       },
//     },
//   },
//   {
//     tableName: 'Users', // explicit table name
//     timestamps: true,   // adds createdAt and updatedAt automatically
//   }
// );



// export default User;











































// // render
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// ---------------------
// Define User model
// ---------------------
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email must be unique',
      },
      validate: {
        isEmail: {
          msg: 'Must be a valid email address',
        },
        notEmpty: {
          msg: 'Email cannot be empty',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty',
        },
        len: {
          args: [6, 100],
          msg: 'Password must be at least 6 characters long',
        },
      },
    },
  },
  {
    tableName: 'Users', // explicit table name
    timestamps: true,   // adds createdAt and updatedAt automatically
  }
);

export default User;
