'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_survey = sequelize.define('tbl_survey', {
		survey_title: DataTypes.STRING,
		survey_description: DataTypes.STRING,
		diagnosis_id: DataTypes.INTEGER
	}, {});
	tbl_survey.associate = function(models) {
    // associations can be defined here
};
return tbl_survey;
};