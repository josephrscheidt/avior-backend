'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_template = sequelize.define('tbl_template', {
    injury_id: {
        type:DataTypes.STRING,
        allowNull: false,
    }, 
    about_desc: {
       type:DataTypes.TEXT,
      allowNull: false,
    },
    about_image: {
      type:DataTypes.STRING,
      allowNull: false,
    }, 
    is_active: {
      type:DataTypes.TINYINT,
      allowNull: false,
    }
  }, {});
  tbl_template.associate = function(models) {
    // associations can be defined here
  };
  return tbl_template;
};