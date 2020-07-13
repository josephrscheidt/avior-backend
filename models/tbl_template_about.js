'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_template_about = sequelize.define('tbl_template_about', {
    template_id: DataTypes.INTEGER,
    about_point: DataTypes.TEXT
  }, {});
  tbl_template_about.associate = function(models) {
    // associations can be defined here
  };
  return tbl_template_about;
};