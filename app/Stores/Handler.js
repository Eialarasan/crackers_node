import { isValidEmail, isValidPassword, isValidPasswordMaxLength, isValidPhoneNumber, isValidUsername, isValidateMaxLength, isValidateUserMaxLength } from "../../util";
import Service from "./Service";

class StoreHandler {
    async StoreAdd(req, res) {
        try {
            const data = req.body
            const { name,price,address,adminId,  email, password } = data
            if (!name) {
                return res.send({ response_code: 2, response_message: "name is missing", response_code: 1 });
            }
            else if (!isValidUsername(name)) {
                return res.send({ response_code: 2, response_message: "user name atleast 3 characters", response_code: 1 });
            } else if (!isValidateUserMaxLength(name)) {
                return res.send({ response_code: 2, response_message: "user name is maximum 20 characters", response_code: 1 });
            } else if (!email) {
                return res.send({ response_code: 2, response_message: "email is missing", response_code: 1 });
            } else if (!isValidEmail(email)) {
                return res.send({ response_code: 2, response_message: "email is should be in correct format", response_code: 1 });
            } else if (!password) {
                return res.send({ response_code: 2, response_message: "password is missing", response_code: 1 });
            } else if (!isValidPassword(password)) {
                return res.send({ response_code: 2, response_message: "password atleast 3 characters", response_code: 1 });
            } else if (!isValidPasswordMaxLength(password)) {
                return res.send({ response_code: 2, response_message: "password maximum 20 characters", response_code: 1 });
            }else if (!adminId) {
                return res.send({ response_code: 2, response_message: "admin is missing", response_code: 1 });
            }else if (!address) {
                return res.send({ response_code: 2, response_message: "address is missing", response_code: 1 });
            } else {
                await Service.StoreAdd(data, res)
            }
        } catch (error) {
            console.error("STORE_ADD",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async StoreLogin(req, res) {
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

    async updateStore(req, res) {
        try {
            const data = req.body
                await Service.UpdateStore(data, res)
        } catch (error) {
            console.error("UPDATE_STORE", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async deleteStore(req, res) {
        try {
            const data = req.body
            await Service.DeleteStore(data, res)
        } catch (error) {
            console.error("DELETE_STORE", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async getStoreList(req, res) {
        try {
            const data=req.query
            await Service.GetStoreList(data,res)
        } catch (error) {
            console.error("GET_STORE_LIST", error)
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
export default new StoreHandler();