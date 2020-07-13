'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_treatment_phases = sequelize.define('tbl_treatment_phases', {
    treatment_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    start_week: DataTypes.INTEGER,
    end_week: DataTypes.INTEGER,
    sequence: DataTypes.INTEGER
  }, {});
  tbl_treatment_phases.associate = function(models) {
    // associations can be defined here
  };
  return tbl_treatment_phases;
};