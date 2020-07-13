'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_patient_hep = sequelize.define('tbl_patient_hep', {
    treatment_id: DataTypes.INTEGER,
    patient_id: DataTypes.INTEGER,
    hep_date: DataTypes.DATE
  }, {});
  tbl_patient_hep.associate = function(models) {
    // associations can be defined here
  };
  return tbl_patient_hep;
};