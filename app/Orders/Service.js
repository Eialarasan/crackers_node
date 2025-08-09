import Entity from '../../Entity/index';
import { Op } from 'sequelize';

class OrderService {
    async createOrder(data, res) {
        try {
            const { customerName, phoneNumber, email, deliveryAddress, productDetails, totalAmount } = data;

            const payload = {
                customerName,
                phoneNumber,
                email,
                deliveryAddress,
                productDetails,
                totalAmount,
                orderStatus: 'pending',
                paymentStatus: 'pending',
                orderDate: new Date()
            };

            await Entity.Order.create(payload);
            return res.send({ 
                status: "success", 
                message: "Order created successfully", 
                response_code: 0 
            });
        } catch (error) {
            console.error("CREATE_ORDER", error);
            return res.status(500).send({ 
                response_code: 2, 
                response_message: "Sorry something went wrong" 
            });
        }
    }

    async getOrderList(data, res) {
        try {
            const whereClause = data.id ? { id: data.id } : {};
            
            const orderList = await Entity.Order.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']]
            });
            
            return res.send({ 
                status: 'success', 
                message: 'success', 
                response: orderList, 
                response_code: 0 
            });
        } catch (error) {
            console.error("GET_ORDER_LIST", error);
            return res.status(500).send({ 
                response_code: 2, 
                response_message: "Sorry something went wrong" 
            });
        }
    }

    async updateOrder(data, res) {
        try {
            const { id, customerName, phoneNumber, email, deliveryAddress,orderStatus } = data;
            const findOrder = await Entity.Order.findOne({
                where: {
                    id: id
                }
            });

            if (!findOrder) {
                return res.send({ 
                    status: "failed", 
                    message: "Order not found", 
                    response_code: 1 
                });
            }

            const payload = {
                customerName,
                phoneNumber,
                email,
                deliveryAddress,
                orderStatus: orderStatus || findOrder.orderStatus, // Preserve existing status if not provided
                orderDate: new Date()   
            };

            await findOrder.update(payload);
            return res.send({ 
                status: "success", 
                message: "Order updated successfully", 
                response_code: 0 
            });
        } catch (error) {
            console.error("UPDATE_ORDER", error);
            return res.status(500).send({ 
                response_code: 2, 
                response_message: "Sorry something went wrong" 
            });
        }
    }

    async updateOrderStatus(data, res) {
        try {
            const { id, orderStatus } = data;
            const findOrder = await Entity.Order.findOne({
                where: {
                    id: id
                }
            });

            if (!findOrder) {
                return res.send({ 
                    status: "failed", 
                    message: "Order not found", 
                    response_code: 1 
                });
            }

            await findOrder.update({ orderStatus });
            return res.send({ 
                status: "success", 
                message: "Order status updated successfully", 
                response_code: 0 
            });
        } catch (error) {
            console.error("UPDATE_ORDER_STATUS", error);
            return res.status(500).send({ 
                response_code: 2, 
                response_message: "Sorry something went wrong" 
            });
        }
    }

    async updatePaymentStatus(data, res) {
        try {
            const { id, paymentStatus } = data;
            const findOrder = await Entity.Order.findOne({
                where: {
                    id: id
                }
            });

            if (!findOrder) {
                return res.send({ 
                    status: "failed", 
                    message: "Order not found", 
                    response_code: 1 
                });
            }

            await findOrder.update({ paymentStatus });
            return res.send({ 
                status: "success", 
                message: "Payment status updated successfully", 
                response_code: 0 
            });
        } catch (error) {
            console.error("UPDATE_PAYMENT_STATUS", error);
            return res.status(500).send({ 
                response_code: 2, 
                response_message: "Sorry something went wrong" 
            });
        }
    }
}

export default new OrderService();
