'use strict';
module.exports = (sequelize, DataTypes) => {
	const tbl_discharge_reasons = sequelize.define('tbl_discharge_reasons', {
		reason: DataTypes.STRING,
		default: DataTypes.BOOLEAN
	}, {
		timestamps : false
	});
	tbl_discharge_reasons.associate = function(models) {
    // associations can be defined here
};
return tbl_discharge_reasons;
};