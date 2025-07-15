"use strict";

module.exports = function (sequelize, DataTypes) {
    const Roles = sequelize.define('Roles', {
        id: {
            field: 'id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: false,
            autoIncrement: true
        },
        roleName: {
            field: 'role_name',
            type: DataTypes.STRING(255),
            allowNull: true
        }

      

    }, {
        tableName: 'Roles',
        timestamps: false,
        underscored: true,

        classMethods: {

        }

    });
   
    Roles.associate = function associate(models) {
        Roles.hasOne(models.User, {
            foreignKey: 'roleId'
        });
    };
    return Roles;
}