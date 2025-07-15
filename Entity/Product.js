"use strict";

module.exports = function (sequelize, DataTypes) {
    const Product = sequelize.define('Product', {
        id: {
            field: 'id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            field: 'name',
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            field: 'description',
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            field: 'price',
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        storeId: {
            field: 'store_id',
            type: DataTypes.INTEGER,
            allowNull: false
        },
         isActive: {
            field: 'is_active',
            type: DataTypes.BOOLEAN,
            defaultValue: true
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
        tableName: 'Product',
        underscored: true,
        timestamps: true
    });

    Product.associate = function (models) {
        // Each Product belongs to one Store
        Product.belongsTo(models.Store, {
            foreignKey: 'storeId',
          
        });
    };

    return Product;
};
