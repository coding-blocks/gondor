'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'user_role',
    {
      role: {
        type: DataTypes.ENUM('Admin', 'Mentor', 'Member'),
        allowNull: false,
      },
    },
    {
      indexes: [{ unique: true, fields: ['role', 'user_id'] }],
    },
  );
  UserRole.associate = function(models) {
    UserRole.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id',
        allowNull: false,
      },
    });
  };

  return UserRole;
};
