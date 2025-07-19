import Entity from '../../Entity/index'
import jwt from 'jsonwebtoken'
import { decryptPass, encryptPass } from '../../util'
import { decrypt } from 'dotenv'
import { Op } from 'sequelize'

class AdminService {
    async AdminRegister(data, res) {
        try {
            const { name, email, password, superAdminId } = data
            const RegisterUser = await Entity.Admin.findOne({
                where: {
                    email: email
                }
            })
            if (RegisterUser) {
                return res.send({ status: "failed", message: "email id is already entered", response_code: 1 })
            } else {
                const payload = {
                    name: name,
                    email: email,
                    password: encryptPass(password),
                    superAdminId: superAdminId,
                    isActive: 1,
                    createdDate: new Date(),
                    role: "admin"
                }
                await Entity.Admin.create(Object.assign({}, payload))
                return res.send({ status: "success", message: "Admin created successfully", response_code: 0 })
            }
        } catch (error) {
            console.error("ADMIN_REGISTER", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async Updateadmin(data, res) {
        try {
            const { id, name, email, password, superAdminId, isActive,active } = data
            const findId = await Entity.Admin.findOne({
                where: {
                    id: id
                }
            })
            if (!findId) {
                res.send({ status: 'failed', message: "admin not found", response_code: 1 })
            } else {
                const payload = {
                    name: name,
                    email: email,
                    password: encryptPass(password),
                    superAdminId: superAdminId,
                    isActive: isActive,
                    updatedAt: new Date(),
                   
                }
                const updateOrganization = await findId.update(Object.assign({}, payload))
                return res.send({ status: "success", message: "admin updated successfully", response_code: 0 })
            }
        } catch (error) {
            console.error("ADMIN_ORGANIZATION", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
    async AdminLogin(data, res) {
        const { email, password } = data
        try {
            const user = {
                email,
                password
            }
            const findUser = await Entity.Admin.findOne({
                where: {
                    email: email,
                    isActive: 1,
                }, include: [
                    {
                        model: Entity.Store, as: 'stores'
                    },

                ]
            })
            if (!findUser || findUser.password != encryptPass(password)) {
                return res.send({ status: "failed", response_message: "Invalid credentials", response_code: 1 })
            }
            user.userId = findUser.id
            let access_token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "1h" })
            res.send({ status: "success", response_message: "You have login succesfully", adminDetails: findUser, access_token: access_token, response_code: 0 })
        } catch (error) {
            console.error("ADMIN_LOGIN", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }



    async DeleteAdmin(data, res) {
        try {
            const { id } = data
            const findId = await Entity.Admin.findOne({
                where: {
                    id: id
                }
            })

            if (!findId) {
                return res.send({ status: "failed", message: "User not found", response_code: 1 })
            } else {
                await findId.destroy()
                return res.send({ status: "success", response_code: 0, response_message: "Admin deleted successfully" })
            }
        } catch (error) {
            console.error("DELETE_ADMIN", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async RefreshToken(res, userId) {
        try {
            const findUser = await Entity.Admin.findOne({
                where: {
                    id: userId
                }
            })
            const user = {
                email: findUser.email,
                password: findUser.password,
                userId
            }
            let access_token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "1h" })
            res.send({ status: "success", message: "Token created succesfully", access_token: access_token, response_code: 0 })
        } catch (error) {
            console.error("REFRESH_TOKEN", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async GetAdminList(data, res) {
        try {
            const adminList = await Entity.Admin.findAll({
                where: (data.search && data.id) ? {
                    isActive: 1,
                    id: data.id,
                    name: { [Op.like]: `%${data.search}%` }
                } : data.id ? {
                    isActive: 1,
                    id: data.id,
                } : data.search ? {
                    isActive: 1,
                    name: { [Op.like]: `%${data.search}%` }
                } : {
                    isActive: 1
                },
                include: [
                    {
                        model: Entity.Store, as: "stores"
                    },

                ]
            })

            
            console.log(typeof(adminData),"admindata")
            return res.send({ status: 'success', response_message: 'success', response: adminList, response_code: 0 })
        } catch (error) {
            console.error("GET_ADMIN_LIST", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
}
export default new AdminService();