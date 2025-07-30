"use strict";

module.exports = function (sequelize, DataTypes) {
    const Category = sequelize.define('Category', {
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
       
        storeId: {
            field: 'store_id',
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
        tableName: 'Category',
        timestamps: false,
        underscored: true
    });

    Category.associate = function (models) {
        Category.belongsTo(models.Store, {
            foreignKey: 'storeId',

        });

        // ✅ Correct alias here to reflect it's for related stores
        Category.hasMany(models.Product, {
            foreignKey: 'categoryId'
        });
    };

    return Category;
};
