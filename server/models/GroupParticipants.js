import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import ChatGroup from './ChatGroup.js';

const GroupParticipants = sequelize.define(
  'GroupParticipants',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: 'GroupParticipants',
    timestamps: true,
  }
);

// Many-to-many association
User.belongsToMany(ChatGroup, { through: GroupParticipants, foreignKey: 'userId', otherKey: 'groupId', as: 'chatGroups' });
ChatGroup.belongsToMany(User, { through: GroupParticipants, foreignKey: 'groupId', otherKey: 'userId', as: 'participants' });

export default GroupParticipants;
