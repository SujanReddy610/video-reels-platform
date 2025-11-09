'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};


















// render
// 'use strict';

// export async function up(queryInterface, Sequelize) {
//   await queryInterface.createTable('Users', {
//     id: {
//       type: Sequelize.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false,
//     },
//     name: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: Sequelize.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     createdAt: {
//       type: Sequelize.DATE,
//       allowNull: false,
//       defaultValue: Sequelize.literal('NOW()'),
//     },
//     updatedAt: {
//       type: Sequelize.DATE,
//       allowNull: false,
//       defaultValue: Sequelize.literal('NOW()'),
//     },
//   });
// }

// export async function down(queryInterface, Sequelize) {
//   await queryInterface.dropTable('Users');
// }
