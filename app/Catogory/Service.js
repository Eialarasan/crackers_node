import Entity from '../../Entity/index'
import jwt from 'jsonwebtoken'
import { decryptPass, encryptPass } from '../../util'
import { decrypt } from 'dotenv'
import { Op } from 'sequelize'

class CategoryService {
    async CategoryAdd(data, res) {
        try {
            const { name, storeId } = data
            const RegisterUser = await Entity.Category.findOne({
                where: {
                    name: name
                }
            })
            // let imageBuffer = null;
            // if (productImage) {
            //     const base64Data = productImage.replace(/^data:image\/\w+;base64,/, '');
            //     imageBuffer = Buffer.from(base64Data, 'base64');
            // }
            if (RegisterUser) {
                return res.send({ status: "failed", message: "product is already entered", response_code: 1 })
            } else {
                const payload = {
                    name: name,
                    storeId: storeId,
                    isActive: 1,
                    createdDate: new Date(),
                    // productImage:imageBuffer,
                }
                await Entity.Category.create(Object.assign({}, payload))
                return res.send({ status: "success", message: "Category created successfully", response_code: 0 })
            }
        } catch (error) {
            console.error("Catogory_ADD", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async UpdateCategory(data, res) {
        try {
            const { id, name, storeId } = data
            const findId = await Entity.Category.findOne({
                where: {
                    id: id
                }
            })
            //  let imageBuffer = null;
            // if (productImage) {
            //     const base64Data = productImage.replace(/^data:image\/\w+;base64,/, '');
            //     imageBuffer = Buffer.from(base64Data, 'base64');
            // }
            if (!findId) {
                res.send({ status: 'failed', message: "category not found", response_code: 1 })
            } else {
                const payload = {
                    name: name,
                    storeId: storeId,
                    isActive: 1,
                    createdDate: new Date(),
                    // productImage:imageBuffer,
                }
                const updateOrganization = await findId.update(Object.assign({}, payload))
                return res.send({ status: "success", message: "category updated successfully", response_code: 0 })
            }
        } catch (error) {
            console.error("PRODUCT_ORGANIZATION", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }




    async DeleteCategory(data, res) {
        try {
            const { id } = data
            const findId = await Entity.Category.findOne({
                where: {
                    id: id
                }
            })

            if (!findId) {
                return res.send({ status: "failed", message: "Category not found", response_code: 1 })
            } else {
                await findId.destroy()
                return res.send({ status: "success", response_code: 0, response_message: "Category deleted successfully" })
            }
        } catch (error) {
            console.error("DELETE_CATEGORY", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async RefreshToken(res, userId) {
        try {
            const findUser = await Entity.Store.findOne({
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

    async GetCategoryList(data, res) {
        try {
            // Build where clause more efficiently
            let where = { isActive: 1 };
            
            if (data.id) {
                where.id = data.id;
            }
            
            if (data.search) {
                where.name = { [Op.iLike]: `${data.search}%` }; // Changed to starts-with search for better index usage
            }

            // Pagination
            const limit = data.limit ? parseInt(data.limit) : 5;
            const offset = data.page ? (parseInt(data.page) - 1) * limit : 0;

            const { count, rows: categoryList } = await Entity.Category.findAndCountAll({
                attributes: ['id', 'name', 'storeId', 'isActive', 'createdAt'], // Select only needed fields
                where,
                include: [
                    {
                        model: Entity.Product,
                        attributes: ['id', 'name'], // Only get essential product fields
                        required: false, // LEFT JOIN instead of INNER JOIN
                        limit: 5, // Limit number of products per category
                        where: { isActive: true }
                    }
                ],
                order: [['createdAt', 'ASC']], // Consistent ordering
                limit,
                offset
            });

            return res.send({
                status: 'success',
                message: 'success',
                response: categoryList,
                total: count,
                currentPage: data.page || 1,
                totalPages: Math.ceil(count / limit),
                hasMore: offset + categoryList.length < count,
                response_code: 0
            })
        } catch (error) {
            console.error("GET_STORE_LIST", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
}
export default new CategoryService();