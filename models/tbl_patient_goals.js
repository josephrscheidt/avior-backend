'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_patient_goals = sequelize.define('tbl_patient_goals', {
    treatment_id: DataTypes.INTEGER,
    patient_id: DataTypes.INTEGER,
    goals: DataTypes.TEXT,
    status: DataTypes.TINYINT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  tbl_patient_goals.associate = function(models) {
    // associations can be defined here
  };
  return tbl_patient_goals;
};