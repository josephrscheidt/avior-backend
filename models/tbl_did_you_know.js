'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_did_you_know = sequelize.define('tbl_did_you_know', {
    template_id: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {});
  tbl_did_you_know.associate = function(models) {
    // associations can be defined here
  };
  return tbl_did_you_know;
};