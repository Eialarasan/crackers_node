import { isValidEmail, isValidPassword, isValidPasswordMaxLength, isValidPhoneNumber, isValidUsername, isValidateMaxLength, isValidateUserMaxLength } from "../../util";
import Service from "./Service";

class AdminHandler {
    async AdminRegister(req, res) {
        try {
            const data = req.body
            const { name,  email, password,superAdminId } = data
            if (!name) {
                return res.send({ response_code: 2, response_message: "name is missing", response_code: 1 });
            }else if(!superAdminId){
                return res.send({ response_code: 2, response_message: "super admin  is missing", response_code: 1 });

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
            } else {
                await Service.AdminRegister(data, res)
            }
        } catch (error) {
            console.error("ADMIN_REGISTER",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async AdminLogin(req, res) {
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
                await Service.AdminLogin(data, res)
            }
        } catch (error) {
            console.error("USER_LOGIN",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async updateAdmin(req, res) {
        try {
            const data = req.body
                await Service.Updateadmin(data, res)
        } catch (error) {
            console.error("UPDATE_ADMIN", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async deleteAdmin(req, res) {
        try {
            const data = req.body
            await Service.DeleteAdmin(data, res)
        } catch (error) {
            console.error("DELETE_ADMIN", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async getAdminList(req, res) {
        try {
            const data=req.query
            await Service.GetAdminList(data,res)
        } catch (error) {
            console.error("GET_ADMIN_LIST", error)
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
export default new AdminHandler();