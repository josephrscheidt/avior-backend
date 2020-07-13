'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_treatment_exercise = sequelize.define('tbl_treatment_exercise', {
    treatment_id: DataTypes.INTEGER,
    exercise_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    reps: DataTypes.INTEGER,
    sets: DataTypes.INTEGER,
    perform: DataTypes.TEXT
  }, {});
  tbl_treatment_exercise.associate = function(models) {
    // associations can be defined here
  };
  return tbl_treatment_exercise;
};