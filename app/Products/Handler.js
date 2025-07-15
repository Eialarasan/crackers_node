import { isValidEmail, isValidPassword, isValidPasswordMaxLength, isValidPhoneNumber, isValidUsername, isValidateMaxLength, isValidateUserMaxLength } from "../../util";
import Service from "./Service";

class ProductFilter {
    async ProductAdd(req, res) {
        try {
            const data = req.body
            const { name,price,storeId} = data
            if (!name) {
                return res.send({ response_code: 2, response_message: "product is missing", response_code: 1 });
            }
             else if (!price) {
                return res.send({ response_code: 2, response_message: "price is missing", response_code: 1 });
            }else if (!storeId) {
                return res.send({ response_code: 2, response_message: "store is missing", response_code: 1 });
            } else {
                await Service.ProductAdd(data, res)
            }
        } catch (error) {
            console.error("PRODUCT_ADD",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async ProductLogin(req, res) {
        try {
            const data = req.body
            const { email, password } = data
            if (!email) {
                return res.send({ response_code: 2, response_message: "email is missing", response_code: 1 });
            } else if (!isValidEmail(email)) {
                return res.send({ response_code: 2, response_message: "email is should be in correct format", response_code: 1 });
            } else if (!password) {
                return res.send({ response_code: 2, response_message: "password is missing", response_code: 1 });
            } else {
                await Service.StoreLogin(data, res)
            }
        } catch (error) {
            console.error("STORE_LOGIN",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async updateProduct(req, res) {
        try {
            const data = req.body
                await Service.UpdateProduct(data, res)
        } catch (error) {
            console.error("UPDATE_PRODUCT", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async deleteProduct(req, res) {
        try {
            const data = req.body
            await Service.DeleteProduct(data, res)
        } catch (error) {
            console.error("DELETE_PRODUCT", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async getProductList(req, res) {
        try {
            const data=req.query
            await Service.GetProductList(data,res)
        } catch (error) {
            console.error("GET_PRODUCT_LIST", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
    async RefreshToken(req, res) {
        try {
            const userId = req.user.userId
            await Service.RefreshToken(res, userId)
        } catch (error) {
            console.error("REFRESH_TOKEN",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
}
export default new ProductFilter();