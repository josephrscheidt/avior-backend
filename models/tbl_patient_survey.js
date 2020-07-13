'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_patient_survey = sequelize.define('tbl_patient_survey', {
		survey_id: DataTypes.INTEGER,
		patient_id: DataTypes.INTEGER,
		score: DataTypes.INTEGER,
		date_survey_taken: DataTypes.DATE
	}, {
		createdAt : 'date_survey_taken',
		updatedAt : false
	});
	tbl_patient_survey.associate = function(models) {
	};
	return tbl_patient_survey;
};