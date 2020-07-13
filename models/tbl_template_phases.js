'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_template_phases = sequelize.define('tbl_template_phases', {
    template_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    start_week: DataTypes.INTEGER,
    end_week: DataTypes.INTEGER,
    sequence: DataTypes.INTEGER
  }, {});
  tbl_template_phases.associate = function(models) {
    // associations can be defined here
  };
  return tbl_template_phases;
};