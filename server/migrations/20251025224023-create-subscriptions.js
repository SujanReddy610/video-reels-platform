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
//   await queryInterface.createTable('Subscriptions', {
//     id: {
//       type: Sequelize.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false,
//     },
//     subscriberId: {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'Users',
//         key: 'id',
//       },
//       onDelete: 'CASCADE',
//     },
//     subscribedToId: {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'Users',
//         key: 'id',
//       },
//       onDelete: 'CASCADE',
//     },
//     createdAt: {
//       type: Sequelize.DATE,
//       allowNull: false,
//       defaultValue: Sequelize.literal('NOW()'),
//     },
//   });
// }

// export async function down(queryInterface, Sequelize) {
//   await queryInterface.dropTable('Subscriptions');
// }

