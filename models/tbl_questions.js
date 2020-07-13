'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_question = sequelize.define('tbl_question', {
		question: DataTypes.STRING,
		set_id: DataTypes.INTEGER
	}, {
		timestamps : false
	});
	tbl_question.associate = function(models) {
	};
	return tbl_question;
};