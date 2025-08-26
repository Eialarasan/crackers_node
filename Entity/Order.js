module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        deliveryAddress: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        productDetails: {
            type: DataTypes.JSONB,  // Using JSONB for better PostgreSQL performance
            allowNull: false,
            comment: 'Stores product information and quantities'
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Store', // lowercase table name for PostgreSQL
                key: 'id'
            }
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        orderStatus: {
            type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
            defaultValue: 'pending'
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'paid', 'failed'),
            defaultValue: 'pending'
        },
        paymentType: {
            type: DataTypes.ENUM('cash', 'upi'),
            allowNull: false,
            defaultValue: 'cash',
            comment: 'cash = cash on delivery, upi = UPI payment'
        },
        orderDate: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('NOW')  // Using PostgreSQL NOW() function
        }
    }, {
        tableName: 'orders',
        timestamps: true
    });

    Order.associate = function(models) {
        // Define associations here if needed
    };

    return Order;
};
