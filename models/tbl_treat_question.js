'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_treat_question = sequelize.define('tbl_treat_question', {
		question: DataTypes.STRING,
		set_id: DataTypes.INTEGER
	}, {
		timestamps : false
	});
	tbl_treat_question.associate = function(models) {
	};
	return tbl_treat_question;
};