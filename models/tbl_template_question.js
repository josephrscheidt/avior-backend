'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_template_question = sequelize.define('tbl_template_question', {
    template_id: DataTypes.INTEGER,
    week: DataTypes.INTEGER,
    priority: DataTypes.INTEGER
  }, {});
  tbl_template_question.associate = function(models) {
    // associations can be defined here
  };
  return tbl_template_question;
};