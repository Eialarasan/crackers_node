import Entity from '../../Entity/index'
import jwt from 'jsonwebtoken'
import { decryptPass, encryptPass } from '../../util'
import { decrypt } from 'dotenv'
import { Op } from 'sequelize'

class ProductService {
    async ProductAdd(data, res) {
        try {
            const { name, originalPrice, offerPrice, storeId, productImage, categoryId } = data
            const RegisterUser = await Entity.Product.findOne({
                where: {
                    name: name
                }
            })
            let imageBuffer = null;
            if (productImage) {
                const base64Data = productImage.replace(/^data:image\/\w+;base64,/, '');
                imageBuffer = Buffer.from(base64Data, 'base64');
            }
            if (RegisterUser) {
                return res.send({ status: "failed", message: "product is already entered", response_code: 1 })
            } else {
                const payload = {
                    name: name,
                    originalPrice: originalPrice,
                    offerPrice: offerPrice || originalPrice, // If no offer price is provided, use original price
                    storeId: storeId,
                    isActive: true,
                    inStock: true, // New products are in stock by default
                    categoryId: categoryId,
                    createdDate: new Date(),
                    productImage: imageBuffer,
                }
                await Entity.Product.create(Object.assign({}, payload))
                return res.send({ status: "success", message: "Product created successfully", response_code: 0 })
            }
        } catch (error) {
            console.error("PRODUCT_ADD", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async UpdateProduct(data, res) {
        try {
            const { id, name, originalPrice, offerPrice, storeId, productImage } = data
            const findId = await Entity.Product.findOne({
                where: {
                    id: id
                }
            })
            let imageBuffer;
            if (typeof productImage === 'string') {
                const base64 = productImage.startsWith('data:')
                    ? productImage.split(',', 2)[1] // strip data URL prefix
                    : productImage;
                imageBuffer = Buffer.from(base64, 'base64');
            } else if (Buffer.isBuffer(productImage)) {
                imageBuffer = productImage;
            } else if (productImage && productImage.buffer && Buffer.isBuffer(productImage.buffer)) {
                // e.g. multer file object
                imageBuffer = productImage.buffer;
            }
            if (productImage) {
                const base64Data = productImage.replace(/^data:image\/\w+;base64,/, '');
                imageBuffer = Buffer.from(base64Data, 'base64');
            }
            if (!findId) {
                res.send({ status: 'failed', message: "product not found", response_code: 1 })
            } else {
                const payload = {
                    name: name,
                    storeId: storeId,
                    originalPrice: originalPrice,
                    offerPrice: offerPrice || originalPrice, // If no offer price is provided, use original price
                    isActive: true,
                    inStock: data.inStock !== undefined ? data.inStock : findId.inStock, // Preserve existing inStock value if not provided
                    createdDate: new Date(),
                    productImage: imageBuffer,
                }
                const updateOrganization = await findId.update(Object.assign({}, payload))
                return res.send({ status: "success", message: "product updated successfully", response_code: 0 })
            }
        } catch (error) {
            console.error("PRODUCT_ORGANIZATION", error)
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
                    isActive: true,
                }
            })
            if (!findUser || findUser.password != encryptPass(password)) {
                return res.send({ status: "failed", response_message: "Invalid credentials", response_code: 1 })
            }
            user.userId = findUser.id
            let access_token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "1h" })
            res.send({ status: "success", response_message: "You have login succesfully", storeDetails: findUser, access_token: access_token, response_code: 0 })
        } catch (error) {
            console.error("STORE_LOGIN", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }



    async DeleteProduct(data, res) {
        try {
            const { id } = data
            const findId = await Entity.Product.findOne({
                where: {
                    id: id
                }
            })

            if (!findId) {
                return res.send({ status: "failed", message: "Product not found", response_code: 1 })
            } else {
                await findId.destroy()
                return res.send({ status: "success", response_code: 0, response_message: "Product deleted successfully" })
            }
        } catch (error) {
            console.error("DELETE_PRODUCT", error)
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

    async GetProductList(data, res) {
        try {
            // Build where clause dynamically
            let where = { isActive: true };
            if (data.id) {
                where.id = data.id;
            }
            if (data.search) {
                where.name = { [Op.like]: `%${data.search}%` };
            }
            if (data.categoryId) {
                where.categoryId = data.categoryId;
            }

            // Pagination
            let limit = 10; // default limit
            let offset = 0;
            if (data.limit && !isNaN(parseInt(data.limit))) {
                limit = parseInt(data.limit);
            }
            if (data.offset && !isNaN(parseInt(data.offset))) {
                offset = parseInt(data.offset);
            } else if (data.page && !isNaN(parseInt(data.page))) {
                // page is 1-based
                offset = (parseInt(data.page) - 1) * limit;
            }

            const { count, rows: productList } = await Entity.Product.findAndCountAll({
                where,
                include: [
                    {
                        model: Entity.Category
                    },
                ],
                limit,
                offset
            });

            // For load more: return nextOffset and hasMore
            const nextOffset = offset + productList.length;
            const hasMore = nextOffset < count;

            return res.send({
                status: 'success',
                message: 'success',
                response: productList,
                total: count,
                nextOffset,
                hasMore,
                response_code: 0
            });
        } catch (error) {
            console.error("GET_STORE_LIST", error);
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
}
export default new ProductService();