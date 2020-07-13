'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_question_type = sequelize.define('tbl_question_type', {
		question_type_desc: DataTypes.STRING
	}, {
		timestamps: false
	});
	tbl_question_type.associate = function(models) {
	};
	return tbl_question_type;
};