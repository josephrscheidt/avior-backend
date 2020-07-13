'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_phases_progress_criteria = sequelize.define('tbl_phases_progress_criteria', {
    phase_id: DataTypes.INTEGER,
    pc_point: DataTypes.TEXT
  }, {});
  tbl_phases_progress_criteria.associate = function(models) {
    // associations can be defined here
  };
  return tbl_phases_progress_criteria;
};