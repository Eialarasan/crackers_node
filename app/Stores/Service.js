import Entity from '../../Entity/index'
import jwt from 'jsonwebtoken'
import { decryptPass, encryptPass } from '../../util'
import { decrypt } from 'dotenv'
import { Op } from 'sequelize'

class StoreService {
    async StoreAdd(data, res) {
        try {
            const { name,address,adminId,  email, password } = data
            const RegisterUser = await Entity.Store.findOne({
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
                    adminId:adminId,
                    
                    address:address,
                    isActive:1,
                    createdDate:new Date(),
                }
                 await Entity.Store.create(Object.assign({}, payload))
                return res.send({ status: "success", message: "Store created successfully", response_code: 0 })
            }
        } catch (error) {
            console.error("STORE_REGISTER",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
    
    async UpdateStore(data, res) {
        try {
            const {id, name,address,adminId,  email, password } = data
            const findId = await Entity.Store.findOne({
                where: {
                    id: id
                }
            })
            if (!findId) {
                res.send({ status: 'failed', message: "store not found", response_code: 1 })
            } else {
                const payload = {
                    name: name,
                    email: email,
                    password: encryptPass(password),
                    adminId:adminId,
                   
                    address:address,
                    isActive:1,
                    createdDate:new Date(),
                }
                const updateOrganization = await findId.update(Object.assign({}, payload))
                return res.send({ status: "success", message: "store updated successfully", response_code: 0 })
            }
        } catch (error) {
            console.error("STORE_ORGANIZATION", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
    async StoreLogin(data, res) {
        const { email, password } = data
        try {
            const user = {
                email,
                password
            }
            const findUser = await Entity.Store.findOne({
                where: {
                    email: email,
                    isActive:1,
                }
            })
            if (!findUser || findUser.password != encryptPass(password)){
                return res.send({ status: "failed", response_message: "Invalid credentials", response_code: 1 })
             }
                user.userId=findUser.id
                let access_token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "1h" })
                res.send({ status: "success", response_message: "You have login succesfully",storeDetails:findUser, access_token: access_token, response_code: 0 })
        } catch (error) {
            console.error("STORE_LOGIN",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

   

    async DeleteStore(data, res) {
        try {
            const { id } = data
            const findId = await Entity.Store.findOne({
                where: {
                    id: id
                }
            })

            if (!findId) {
                return res.send({ status: "failed", message: "Store not found", response_code: 1 })
            } else {
                await findId.destroy()
                return res.send({ status: "success",response_code:0, response_message: "Store deleted successfully" })
            }
        } catch (error) {
            console.error("DELETE_Store", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async RefreshToken( res,userId) {
        try {
            const findUser = await Entity.Store.findOne({
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

    async GetStoreList(data,res) {
        try {
            const storeList = await Entity.Store.findAll({
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
             
            })
            return res.send({ status: 'success', message: 'success', response: storeList, response_code: 0 })
        } catch (error) {
            console.error("GET_STORE_LIST", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
}
export default new StoreService();