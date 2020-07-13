'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_survey_question = sequelize.define('tbl_survey_question', {
		survey_id: DataTypes.INTEGER,
		question_text: DataTypes.STRING,
		question_type: DataTypes.INTEGER
	}, {});
	tbl_survey_question.associate = function(models) {
	};
	return tbl_survey_question;
};