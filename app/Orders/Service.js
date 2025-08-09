import Entity from '../../Entity/index';
import { Op } from 'sequelize';
import whatsAppService from '../../services/WhatsappService';

class OrderService {
    async createOrder(data, res) {
        try {
            const { customerName, phoneNumber, email, deliveryAddress, productDetails, totalAmount, storeId } = data;

            const payload = {
                customerName,
                phoneNumber,
                email,
                deliveryAddress,
                productDetails,
                totalAmount,
                storeId,
                orderStatus: 'pending',
                paymentStatus: 'pending',
                orderDate: new Date()
            };

            const order = await Entity.Order.create(payload);

            // Get store details for WhatsApp notification
            const store = await Entity.Store.findOne({
                where: { id: storeId }
            });
            console.log(store,"store details");

            if (store && store.phoneNumber) {
                try {
                    await whatsAppService.sendOrderNotification(store.phoneNumber, {
                        id: order.id,
                        customerName: order.customerName,
                        phoneNumber: order.phoneNumber,
                        productDetails: order.productDetails,
                        totalAmount: order.totalAmount,
                        deliveryAddress: order.deliveryAddress
                    });
                } catch (whatsappError) {
                    console.error('WhatsApp notification failed:', whatsappError);
                    // Continue with the order creation even if WhatsApp notification fails
                }
            }

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
