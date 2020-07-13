'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_injury = sequelize.define('tbl_injury', {
    injury_name: DataTypes.STRING
  }, {});
  tbl_injury.associate = function(models) {
    // associations can be defined here
  };
  return tbl_injury;
};