'use strict';
module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    body: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [ 3, 5000 ] }
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [ 3, 100 ] }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here

        Question.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          as: 'author'
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
