'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_role = sequelize.define('tbl_role', {
    role_name: DataTypes.STRING
  }, {});
  tbl_role.associate = function(models) {
    // associations can be defined here
  };
  return tbl_role;
};