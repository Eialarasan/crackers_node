module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deliveryAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productDetails: {
            type: DataTypes.JSON,
            allowNull: false,
            comment: 'Stores product information and quantities'
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
        orderDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
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
