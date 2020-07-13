'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_exercise_alias = sequelize.define('tbl_exercise_alias', {
    exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    therapist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clinic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  tbl_exercise_alias.associate = function(models) {
    // associations can be defined here
  };
  return tbl_exercise_alias;
};