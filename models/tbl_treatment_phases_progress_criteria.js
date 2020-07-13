'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_treatment_phases_progress_criteria = sequelize.define('tbl_treatment_phases_progress_criteria', {
		set_id: DataTypes.INTEGER,
		pc_point: DataTypes.TEXT
	}, {});
	tbl_treatment_phases_progress_criteria.associate = function(models) {
    // associations can be defined here
};
return tbl_treatment_phases_progress_criteria;
};