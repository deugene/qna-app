'use strict';
module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    body: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [ 3, 5000 ] }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here

        Question.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        });

        Question.hasMany(models.Answer, {
          foreignKey: 'questionId',
          as: 'answers'
        });
      }
    }
  });
  return Question;
};
