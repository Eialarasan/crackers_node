"use strict";

module.exports = function (sequelize, DataTypes) {
    const SuperAdmin = sequelize.define('SuperAdmin', {
        id: {
            field: 'id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            field: 'name',
            type: DataTypes.STRING(255),
            allowNull: true
        }, email: {
            field: 'email',
            type: DataTypes.STRING(255),
            allowNull: true
        },
        password: {
            field: 'password',
            type: DataTypes.STRING(255),
            allowNull: true
        },
    }, {
        tableName: 'SuperAdmin',
        timestamps: false,
        underscored: true
    });

    SuperAdmin.associate = function (models) {
        SuperAdmin.hasMany(models.Admin, {
            foreignKey: 'superAdminId',
            as: 'admins'
        });
    };

    return SuperAdmin;
};
