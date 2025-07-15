import { isValidEmail, isValidPassword, isValidPasswordMaxLength, isValidPhoneNumber, isValidUsername, isValidateMaxLength, isValidateUserMaxLength } from "../../util";
import Service from "./Service";

class UserHandler {
    async UserRegister(req, res) {
        try {
            const data = req.body
            const { user_name, phone_number, email, password } = data
            if (!user_name) {
                return res.send({ response_code: 2, response_message: "user name is missing", response_code: 1 });
            }
            else if (!isValidUsername(user_name)) {
                return res.send({ response_code: 2, response_message: "user name atleast 3 characters", response_code: 1 });
            } else if (!isValidateUserMaxLength(user_name)) {
                return res.send({ response_code: 2, response_message: "user name is maximum 20 characters", response_code: 1 });
            } else if (!phone_number) {
                return res.send({ response_code: 2, response_message: "phone number is missing", response_code: 1 });
            } else if (typeof phone_number==="string") {
                return res.send({ response_code: 2, response_message: "phone number must be in number", response_code: 1 });
            } else if (!isValidPhoneNumber(phone_number)) {
                return res.send({ response_code: 2, response_message: "phone number must be in 10 digits", response_code: 1 });
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
                await Service.UserRegister(data, res)
            }
        } catch (error) {
            console.error("USER_REGISTER",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async UserLogin(req, res) {
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
                await Service.UserLogin(data, res)
            }
        } catch (error) {
            console.error("USER_LOGIN",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async updateUser(req, res) {
        try {
            const data = req.body
                await Service.Updateuser(data, res)
        } catch (error) {
            console.error("UPDATE_USER", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async deleteUser(req, res) {
        try {
            const data = req.body
            await Service.DeleteUser(data, res)
        } catch (error) {
            console.error("DELETE_USER", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async getUserList(req, res) {
        try {
            const data=req.query
            await Service.GetUserList(data,res)
        } catch (error) {
            console.error("GET_USER_LIST", error)
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
export default new UserHandler();