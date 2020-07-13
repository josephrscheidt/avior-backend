'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_exercise = sequelize.define('tbl_exercise', {
    injury_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    group_id: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull :false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    purpose: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.TINYINT,
      allowNull: false,
    }
  });
  tbl_exercise.associate = function(models) {
    // associations can be defined here
  };
  return tbl_exercise;
};
