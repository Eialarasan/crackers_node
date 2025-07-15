"use strict";

module.exports = function (sequelize, DataTypes) {
    const Store = sequelize.define('Store', {
        id: {
            field: 'id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            field: 'name',
            type: DataTypes.STRING(255),
            allowNull: false
        },
        address: {
            field: 'address',
            type: DataTypes.STRING(255)
        },
        adminId: {
            field: 'admin_id',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            field: 'email',
            type: DataTypes.STRING(255)
        },
        password: {
            field: 'password',
            type: DataTypes.STRING(255)
        },
        isActive: {
            field: 'is_active',
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Store',
        timestamps: false,
        underscored: true
    });

    Store.associate = function (models) {
        Store.belongsTo(models.Admin, {
            foreignKey: 'adminId',
            as: 'admin'
        });

        Store.hasMany(models.Product, {
            foreignKey: 'storeId'
        });
    };

    return Store;
};
