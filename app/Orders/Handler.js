import Service from "./Service";

class OrderFilter {
    async createOrder(req, res) {
        try {
            const data = req.body;
            const { customerName, phoneNumber, deliveryAddress, productDetails, totalAmount } = data;

            if (!customerName) {
                return res.send({ response_code: 2, response_message: "Customer name is missing", response_code: 1 });
            } else if (!phoneNumber) {
                return res.send({ response_code: 2, response_message: "Phone number is missing", response_code: 1 });
            } else if (!deliveryAddress) {
                return res.send({ response_code: 2, response_message: "Delivery address is missing", response_code: 1 });
            } else if (!productDetails || !Array.isArray(productDetails) || productDetails.length === 0) {
                return res.send({ response_code: 2, response_message: "Product details are missing or invalid", response_code: 1 });
            } else if (!totalAmount) {
                return res.send({ response_code: 2, response_message: "Total amount is missing", response_code: 1 });
            } else {
                await Service.createOrder(data, res);
            }
        } catch (error) {
            console.error("CREATE_ORDER", error);
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async getOrderList(req, res) {
        try {
            const data = req.query;
            await Service.getOrderList(data, res);
        } catch (error) {
            console.error("GET_ORDER_LIST", error);
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async updateOrder(req, res) {
        try {
            const data = req.body;
            await Service.updateOrder(data, res);
        } catch (error) {
            console.error("UPDATE_ORDER", error);
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const data = req.body;
            await Service.updateOrderStatus(data, res);
        } catch (error) {
            console.error("UPDATE_ORDER_STATUS", error);
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async updatePaymentStatus(req, res) {
        try {
            const data = req.body;
            await Service.updatePaymentStatus(data, res);
        } catch (error) {
            console.error("UPDATE_PAYMENT_STATUS", error);
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
}

export default new OrderFilter();
