'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_treatment_question = sequelize.define('tbl_treatment_question', {
		treatment_id: DataTypes.INTEGER,
		week: DataTypes.INTEGER,
		priority: DataTypes.INTEGER
	}, {});
	tbl_treatment_question.associate = function(models) {
    // associations can be defined here
};
return tbl_treatment_question;
};