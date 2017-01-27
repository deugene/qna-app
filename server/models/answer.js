'use strict';
module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define('Answer', {
    body: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [ 3, 5000 ] }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here

        Answer.belongsTo(models.Question, {
          foreignKey: 'questionId',
          onDelete: 'CASCADE'
        });
        Answer.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          as: 'author'
        });
      }
    }
  });
  return Answer;
};
