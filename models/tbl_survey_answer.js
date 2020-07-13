'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_survey_answer = sequelize.define('tbl_survey_answer', {
		answer_choice: DataTypes.STRING,
		answer_score: DataTypes.DECIMAL,
		survey_id: DataTypes.INTEGER,
		survey_question_id: DataTypes.INTEGER
	}, {
		timestamps: false
	});
	tbl_survey_answer.associate = function(models) {
	};
	return tbl_survey_answer;
};