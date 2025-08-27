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
            // Initialize empty where clause
            let whereClause = {};

            // Only add filters if they are provided and valid
            if (Object.keys(data).length > 0) {
                // Add ID filter
                if (data.id && !isNaN(parseInt(data.id))) {
                    whereClause.id = parseInt(data.id);
                }

                // Add order status filter
                if (data.orderStatus && data.orderStatus.trim() && 
                    data.orderStatus.toLowerCase() !== 'all') {
                    whereClause.orderStatus = data.orderStatus.trim();
                }

                // Add payment status filter
                if (data.paymentStatus && data.paymentStatus.trim() && 
                    data.paymentStatus.toLowerCase() !== 'all') {
                    whereClause.paymentStatus = data.paymentStatus.trim();
                }

                // Add payment type filter
                if (data.paymentType && data.paymentType.trim() && 
                    data.paymentType.toLowerCase() !== 'all') {
                    whereClause.paymentType = data.paymentType.trim();
                }

                // Add date range filter if both dates are provided and valid
                if (data.startDate && data.endDate) {
                    const startDate = new Date(data.startDate);
                    const endDate = new Date(data.endDate);
                    
                    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                        whereClause.orderDate = {
                            [Op.between]: [startDate, endDate]
                        };
                    }
                }

                // Add search filter if provided
                if (data.search && typeof data.search === 'string' && data.search.trim()) {
                    const searchTerm = data.search.trim();
                    const searchNumber = parseInt(searchTerm);
                    
                    whereClause[Op.or] = [
                        { customerName: { [Op.iLike]: `%${searchTerm}%` } },
                        { phoneNumber: { [Op.iLike]: `%${searchTerm}%` } },
                        { email: { [Op.iLike]: `%${searchTerm}%` } },
                        // Search by order number if the search term is a number
                        ...((!isNaN(searchNumber)) ? [{ id: searchNumber }] : [])
                    ];

                    // If searching by ID specifically
                    if (data.searchById && !isNaN(searchNumber)) {
                        whereClause[Op.or] = [{ id: searchNumber }];
                    }
                }
            }

            // Pagination with defaults and validation
            const page = Math.max(1, parseInt(data.page) || 1);
            const limit = Math.min(50, Math.max(1, parseInt(data.limit) || 10)); // Limit between 1 and 50
            const offset = (page - 1) * limit;

            // Query configuration
            const queryOptions = {
                where: whereClause,
                order: [['createdAt', 'ASC']],
                attributes: [
                    'id', 'customerName', 'phoneNumber', 'email', 
                    'deliveryAddress', 'totalAmount', 'orderStatus',
                    'paymentStatus', 'paymentType', 'orderDate',
                    'productDetails', // Added back productDetails
                    'storeId', // Added storeId as it might be needed
                    'createdAt' // Added for tracking
                ],
                raw: true, // Significantly faster as it skips model instantiation
                nest: true // Better organization of nested data
            };

            // Add pagination only if specified
            if (data.page || data.limit) {
                queryOptions.limit = limit;
                queryOptions.offset = offset;
            }

            try {
                // Execute query with proper error handling
                const [count, orders] = await Promise.all([
                    Entity.Order.count({ where: whereClause }),
                    Entity.Order.findAll(queryOptions)
                ]);

                // Prepare response message based on filters and results
                const hasFilters = Object.keys(whereClause).length > 0;
                const responseMessage = orders.length > 0 
                    ? hasFilters 
                        ? 'Filtered orders retrieved successfully'
                        : 'All orders retrieved successfully'
                    : hasFilters 
                        ? 'No orders found matching the filters'
                        : 'No orders found in the system';

                return res.send({ 
                    status: 'success', 
                    message: responseMessage, 
                    response: orders,
                    metadata: {
                        total: count,
                        currentPage: data.page ? page : 1,
                        totalPages: data.page ? Math.ceil(count / limit) : 1,
                        hasMore: data.page ? offset + orders.length < count : false,
                        appliedFilters: hasFilters ? Object.keys(whereClause) : [],
                        limit: data.page ? limit : count
                    },
                    response_code: 0 
                });

            } catch (dbError) {
                console.error("Database query error:", dbError);
                throw dbError; // Re-throw for main error handler
            }
        } catch (error) {
            console.error("GET_ORDER_LIST", error);

            // Handle specific database errors
            if (error.name === 'SequelizeConnectionRefusedError') {
                return res.status(503).send({ 
                    status: 'error',
                    response_code: 3, 
                    response_message: "Database connection error. Please try again later." 
                });
            }

            return res.status(500).send({ 
                status: 'error',
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
