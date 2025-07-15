import Entity from '../../Entity/index'
import jwt from 'jsonwebtoken'
import { decryptPass, encryptPass } from '../../util'
import { decrypt } from 'dotenv'
import { Op } from 'sequelize'

class SuperadminService {
      async SuperadminService(data, res) {
            const { email, password } = data
            try {
                const user = {
                    email,
                    password
                }
                const findUser = await Entity.SuperAdmin.findOne({
                    where: {
                        email: email,
                       
                    }
                })
                console.log(findUser,"findUser")
                if (!findUser || findUser.password != password){
                    return res.send({ status: "failed", response_message: "Invalid credentials", response_code: 1 })
                 }
                    user.userId=findUser.id
                    let access_token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "1h" })
                    const loginDetails={
                       id:findUser&&findUser.id, name:findUser&&findUser.name,email:findUser.email
                    }
                    res.send({ status: "success", response_message: "You have login succesfully",loginDetails:loginDetails, access_token: access_token, response_code: 0 })
            } catch (error) {
                console.error("ADMIN_LOGIN",error)
                return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
            }
        }
}

export default new SuperadminService