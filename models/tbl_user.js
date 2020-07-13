'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_user = sequelize.define('tbl_user', {
    role_id: DataTypes.INTEGER,
    clinic_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    contact_no: DataTypes.INTEGER,
    address: DataTypes.TEXT,
    is_active: DataTypes.TINYINT,
    discharge: DataTypes.INTEGER,
    createdAt: DataTypes.INTEGER,
    updatedAt: DataTypes.INTEGER,
    filled_out_review: DataTypes.INTEGER,
  }, {});
  tbl_user.associate = function(models) {
    // associations can be defined here
  };
  return tbl_user;
};
