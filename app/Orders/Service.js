import Entity from '../../Entity/index';
import { Op } from 'sequelize';
import EmailService from '../../util/emailService';
import { getNewOrderEmailTemplate } from '../../util/emailTemplates';

class OrderService {
    async createOrder(data, res) {
        try {
            const { customerName, phoneNumber, email, deliveryAddress, productDetails, totalAmount, paymentType } = data;

            const firstStore = await Entity.Store.findOne({
                order: [['id', 'ASC']]
            });


            const payload = {
                customerName,
                phoneNumber,
                email,
                deliveryAddress,
                productDetails,
                totalAmount,
                storeId: firstStore.id,
                paymentType: paymentType || 'cash',
                orderStatus: 'pending',
                paymentStatus: 'pending',
                orderDate: new Date()
            };

            const newOrder = await Entity.Order.create(payload);

            const store = await Entity.Store.findOne({
                where: { id: firstStore.id }
            });

            if (store && store.email) {
                const emailTemplate = getNewOrderEmailTemplate(
                    {
                        id: newOrder.id,
                        orderDate: newOrder.orderDate,
                        totalAmount: totalAmount,
                        paymentType: paymentType || 'cash',
                        productDetails: productDetails
                    },
                    {
                        customerName,
                        phoneNumber,
                        email,
                        deliveryAddress
                    }
                );

                await EmailService.sendEmail(
                    store.email,
                    `New Crackers Order Received - Order #${newOrder.id}`,
                    emailTemplate
                );
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
            const { id, customerName, phoneNumber, email, deliveryAddress, orderStatus, paymentType } = data;
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
                paymentType: paymentType || findOrder.paymentType, // Preserve existing paymentType if not provided
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
