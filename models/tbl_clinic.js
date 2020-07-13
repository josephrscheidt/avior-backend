'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_clinic = sequelize.define('tbl_clinic', {
    clinic_name: {
      type: DataTypes.STRING,
    },
    google_review_link:{
      type: DataTypes.STRING
    }
  }, {});
  tbl_clinic.associate = function(models) {
    // associations can be defined here
  };
  return tbl_clinic;
};
