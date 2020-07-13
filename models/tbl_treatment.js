'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_treatment = sequelize.define('tbl_treatment', {
    patient_id: DataTypes.INTEGER,
    pt_id: DataTypes.INTEGER,
    injury_id: DataTypes.INTEGER,
    template_id: DataTypes.INTEGER,
    week_day: DataTypes.STRING,
    start_date: DataTypes.DATE
  }, {});
  tbl_treatment.associate = function(models) {
    // associations can be defined here
  };
  return tbl_treatment;
};