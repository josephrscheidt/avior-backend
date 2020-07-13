'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_patient_pain = sequelize.define('tbl_patient_pain', {
		treatment_id: DataTypes.INTEGER,
		week: DataTypes.INTEGER,
		q1: DataTypes.INTEGER,
	}, {});
	tbl_patient_pain.associate = function(models) {
    // associations can be defined here
};
return tbl_patient_pain;
};