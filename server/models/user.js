'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { len: [ 3, 50 ] }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here

        User.hasMany(models.Question, {
          foreignKey: 'userId',
          as: 'questions'
        });
        User.hasMany(models.Answer, {
          foreignKey: 'userId',
          as: 'answers'
        });
      }
    }
  });
  return User;
};
