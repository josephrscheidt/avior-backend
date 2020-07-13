'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_treatment_phases_point = sequelize.define('tbl_treatment_phases_point', {
		set_id: DataTypes.INTEGER,
		point: DataTypes.TEXT
	}, {});
	tbl_treatment_phases_point.associate = function(models) {
    // associations can be defined here
};
return tbl_treatment_phases_point;
};