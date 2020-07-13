'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_phases_point = sequelize.define('tbl_phases_point', {
		phase_id: DataTypes.INTEGER,
		point: DataTypes.TEXT
	}, {});
	tbl_phases_point.associate = function(models) {
    // associations can be defined here
};
return tbl_phases_point;
};