"use strict";

module.exports = function (sequelize, DataTypes) {
    const Admin = sequelize.define('Admin', {
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
        },
        email: {
            field: 'email',
            type: DataTypes.STRING(255),
            allowNull: true
        },
        password: {
            field: 'password',
            type: DataTypes.STRING(255),
            allowNull: true
        },
        superAdminId: {
            field: 'super_admin_id',
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isActive: {
            field: 'is_active',
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Admin',
        timestamps: false,
        underscored: true
    });

    Admin.associate = function (models) {
        Admin.belongsTo(models.SuperAdmin, {
            foreignKey: 'superAdminId',
            as: 'superAdmin'
        });

        // ✅ Correct alias here to reflect it's for related stores
        Admin.hasMany(models.Store, {
            foreignKey: 'adminId',
            as: 'stores'
        });
    };

    return Admin;
};
