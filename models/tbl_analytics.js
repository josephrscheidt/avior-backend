'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_analytics = sequelize.define('tbl_analytics', {
    type: {
      type: DataTypes.STRING,
    },
    userId:{
      type: DataTypes.INTEGER
    },
    clinicId: {
      type: DataTypes.INTEGER,
    },
    roleId:{
      type: DataTypes.INTEGER
    },
    data: {
      type: DataTypes.STRING,
    }
  }, {});
  tbl_analytics.associate = function(models) {
    // associations can be defined here
  };
  return tbl_analytics;
};
