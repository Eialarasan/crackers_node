import Entity from '../../Entity/index'
import jwt from 'jsonwebtoken'
import { decryptPass, encryptPass } from '../../util'
import { decrypt } from 'dotenv'
import { Op } from 'sequelize'

class UserService {
    async UserRegister(data, res) {
        try {
            const { user_name, phone_number, email, password,roleId } = data
            const RegisterUser = await Entity.User.findOne({
                where: {
                    email: email
                }
            })
            if (RegisterUser) {
                return res.send({ status: "failed", message: "email id is already entered", response_code: 1 })
            } else {
                const payload = {
                    userName: user_name,
                    phoneNumber: phone_number,
                    email: email,
                    password: encryptPass(password),
                    roleId:roleId,
                    isActive:1,
                    createdDate:new Date(),
                }
                 await Entity.User.create(Object.assign({}, payload))
                return res.send({ status: "success", message: "User created successfully", response_code: 0 })
            }
        } catch (error) {
            console.error("USER_REGISTER",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
    
    async Updateuser(data, res) {
        try {
            const { id,user_name, phone_number, email, password ,roleId,isActive} = data
            const findId = await Entity.User.findOne({
                where: {
                    id: id
                }
            })
            if (!findId) {
                res.send({ status: 'failed', message: "user not found", response_code: 1 })
            } else {
                const payload = {
                    userName: user_name,
                    phoneNumber: phone_number,
                    email: email,
                    password: encryptPass(password),
                    roleId:roleId,
                    isActive:isActive,
                    createdDate:new Date(),
                }
                const updateOrganization = await findId.update(Object.assign({}, payload))
                return res.send({ status: "success", message: "user updated successfully", response_code: 0 })
            }
        } catch (error) {
            console.error("UPDATE_ORGANIZATION", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
    async UserLogin(data, res) {
        const { email, password } = data
        try {
            const user = {
                email,
                password
            }
            const findUser = await Entity.User.findOne({
                where: {
                    email: email,
                    isActive:1,
                }, include: [
                    {
                        model: Entity.Roles,
                    },

                ]
            })
            if (!findUser || findUser.password != encryptPass(password)){
                return res.send({ status: "failed", response_message: "Invalid credentials", response_code: 1 })
             }
                user.userId=findUser.id
                let access_token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "1h" })
                res.send({ status: "success", response_message: "You have login succesfully",userDetails:findUser, access_token: access_token, response_code: 0 })
        } catch (error) {
            console.error("USER_LOGIN",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

   

    async DeleteUser(data, res) {
        try {
            const { id } = data
            const findId = await Entity.User.findOne({
                where: {
                    id: id
                }
            })

            if (!findId) {
                return res.send({ status: "failed", message: "User not found", response_code: 1 })
            } else {
                await findId.destroy()
                return res.send({ status: "success",response_code:0, response_message: "User deleted successfully" })
            }
        } catch (error) {
            console.error("DELETE_USER", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async RefreshToken( res,userId) {
        try {
            const findUser = await Entity.User.findOne({
                where: {
                    id: userId
                }
            })
            const user={
                email:findUser.email,
                password:findUser.password,
                userId
            }
            let access_token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "1h" })
            res.send({ status: "success", message: "Token created succesfully", access_token: access_token, response_code: 0 })
        } catch (error) {
            console.error("REFRESH_TOKEN",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async GetUserList(data,res) {
        try {
            const rolesList = await Entity.User.findAll({
                where: (data.search&&data.id)? {
                    isActive: 1,
                   id:data.id,
                   userName:{ [Op.like]: `%${data.search}%`}
                }:data.id? {
                    isActive: 1,
                    id:data.id,
                }:data.search?{
                    isActive: 1,
                    
                    userName:{ [Op.like]: `%${data.search}%`}
                }:{
                    isActive:1
                },
                include: [
                    {
                        model: Entity.Roles,
                    },

                ]
            })
            return res.send({ status: 'success', message: 'success', response: rolesList, response_code: 0 })
        } catch (error) {
            console.error("GET_USER_LIST", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
}
export default new UserService();