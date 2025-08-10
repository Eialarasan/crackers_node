import jwt from "jsonwebtoken";

class CustomerHandler {
    async getCustomerToken(req, res) {
        try {
            // You can add customer info here if needed
            const payload = { role: "customer" };
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: "7d" });
            return res.send({ status: "success", token });
        } catch (error) {
            return res.status(500).send({ status: "failed", message: "Token generation failed" });
        }
    }
}

export default new CustomerHandler();
